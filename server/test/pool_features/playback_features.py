import datetime
from unittest.mock import Mock

import pytest
from sqlalchemy import select
from starlette.testclient import TestClient

from api.common.dependencies import RequestsClient, SpotifyClientRaw
from api.pool.dependencies import PoolDatabaseConnectionRaw, PoolSpotifyClientRaw, PoolPlaybackServiceRaw
from api.pool.tasks import queue_next_songs
from database.database_connection import ConnectionManager
from database.entities import PlaybackSession


@pytest.fixture
def fixed_track_length_ms(minutes: int = 3, seconds: int = 30):
    return (minutes * 60 + seconds) * 1000


@pytest.fixture
def existing_playback(db_connection: ConnectionManager, create_mock_track_search_result,
                      build_success_response, requests_client, create_pool_creation_data_json,
                      test_client: TestClient, valid_token_header, fixed_track_length_ms):
    tracks = [create_mock_track_search_result() for _ in range(15)]
    for track in tracks:
        track["duration_ms"] = fixed_track_length_ms
    responses = [build_success_response(track) for track in tracks]
    requests_client.get = Mock(side_effect=responses)
    track_uris = [track["uri"] for track in tracks]
    data_json = create_pool_creation_data_json(*track_uris)
    test_client.post("/pool", json=data_json, headers=valid_token_header)
    return tracks


@pytest.fixture
def pool_db_connection(db_connection: ConnectionManager):
    return PoolDatabaseConnectionRaw(db_connection)


@pytest.fixture
def pool_spotify_client(requests_client: RequestsClient):
    return PoolSpotifyClientRaw(SpotifyClientRaw(requests_client))


@pytest.fixture
def playback_service(pool_db_connection, pool_spotify_client, mock_token_holder):
    return PoolPlaybackServiceRaw(pool_db_connection, pool_spotify_client, mock_token_holder)


def should_start_pool_playback_from_tracks_when_posting_new_pool_from_tracks(create_mock_track_search_result,
                                                                             requests_client, build_success_response,
                                                                             create_pool_creation_data_json,
                                                                             test_client, valid_token_header):
    tracks = [create_mock_track_search_result() for _ in range(15)]
    responses = [build_success_response(track) for track in tracks]
    requests_client.get = Mock(side_effect=responses)
    track_uris = [track["uri"] for track in tracks]
    data_json = create_pool_creation_data_json(*track_uris)

    test_client.post("/pool", json=data_json, headers=valid_token_header)

    actual_call = requests_client.put.call_args
    assert actual_call.kwargs["json"]["position_ms"] == 0
    call_uri = actual_call.kwargs["json"]["uris"][0]
    assert call_uri in track_uris


def should_start_pool_playback_from_collection_tracks_when_posting_collection(create_mock_track_search_result,
                                                                              create_mock_playlist_search_result,
                                                                              requests_client, build_success_response,
                                                                              create_pool_creation_data_json,
                                                                              test_client, valid_token_header):
    tracks = [create_mock_track_search_result() for _ in range(25)]
    playlist = create_mock_playlist_search_result(tracks)
    requests_client.get = Mock(return_value=build_success_response(playlist))
    data_json = create_pool_creation_data_json(playlist["uri"])

    test_client.post("/pool", json=data_json, headers=valid_token_header)

    actual_call = requests_client.put.call_args
    assert actual_call.kwargs["json"]["position_ms"] == 0
    call_uri = actual_call.kwargs["json"]["uris"][0]
    assert call_uri in [track["uri"] for track in tracks]


@pytest.mark.parametrize("repeat", range(15))
def should_not_start_pool_playback_from_collection_uri_when_posting_collection(create_mock_track_search_result,
                                                                               create_mock_playlist_search_result,
                                                                               requests_client, build_success_response,
                                                                               create_pool_creation_data_json,
                                                                               test_client, valid_token_header, repeat):
    # use only one track so test fails with repeats if main collection is ever used
    tracks = [create_mock_track_search_result() for _ in range(1)]
    playlist = create_mock_playlist_search_result(tracks)
    requests_client.get = Mock(return_value=build_success_response(playlist))
    data_json = create_pool_creation_data_json(playlist["uri"])

    test_client.post("/pool", json=data_json, headers=valid_token_header)

    actual_call = requests_client.put.call_args
    assert actual_call.kwargs["json"]["position_ms"] == 0
    call_uri = actual_call.kwargs["json"]["uris"][0]
    assert call_uri == tracks[0]["uri"]


def should_save_next_track_change_time_on_playback_start(create_mock_track_search_result, requests_client,
                                                         build_success_response, create_pool_creation_data_json,
                                                         test_client, valid_token_header, db_connection,
                                                         logged_in_user_id):
    tracks = [create_mock_track_search_result() for _ in range(1)]
    responses = [build_success_response(track) for track in tracks]
    requests_client.get = Mock(side_effect=responses)
    track_uris = [track["uri"] for track in tracks]
    data_json = create_pool_creation_data_json(*track_uris)
    start_time = datetime.datetime.now()

    test_client.post("/pool", json=data_json, headers=valid_token_header)

    with db_connection.session() as session:
        playback_session = session.scalar(select(PlaybackSession).where(PlaybackSession.user_id == logged_in_user_id))
    expected_end_time = start_time + datetime.timedelta(milliseconds=tracks[0]["duration_ms"])
    assert playback_session.next_song_change_timestamp - expected_end_time < datetime.timedelta(milliseconds=100)


def should_add_song_to_playback_if_state_next_song_is_under_two_seconds_away(existing_playback, monkeypatch,
                                                                             fixed_track_length_ms, valid_token_header,
                                                                             playback_service, requests_client,
                                                                             get_query_parameter):
    delta_to_soon = datetime.timedelta(milliseconds=(fixed_track_length_ms - 1000))
    soon = datetime.datetime.now() + delta_to_soon
    soon_utc = datetime.datetime.now(datetime.timezone.utc) + delta_to_soon

    class MockDateTime:
        @classmethod
        def now(cls, tz_info=None):
            return soon if tz_info is None else soon_utc

    monkeypatch.setattr(datetime, "datetime", MockDateTime)
    queue_next_songs(playback_service)
    actual_call = requests_client.post.call_args
    assert actual_call.args[0].startswith("https://api.spotify.com/v1/me/player/queue")
    called_uri = get_query_parameter(actual_call.args[0], "uri")
    assert called_uri in [track["uri"] for track in existing_playback]
    assert actual_call.kwargs["headers"]["Authorization"] == valid_token_header["token"]


def should_not_add_song_to_playback_if_state_next_song_is_over_two_seconds_away(existing_playback, monkeypatch,
                                                                                fixed_track_length_ms,
                                                                                playback_service, requests_client):
    delta_to_soon = datetime.timedelta(milliseconds=(fixed_track_length_ms - 3000))
    soon = datetime.datetime.now() + delta_to_soon
    soon_utc = datetime.datetime.now(datetime.timezone.utc) + delta_to_soon

    class MockDateTime:
        @classmethod
        def now(cls, tz_info=None):
            return soon if tz_info is None else soon_utc

    monkeypatch.setattr(datetime, "datetime", MockDateTime)
    queue_next_songs(playback_service)
    actual_call = requests_client.post.call_args
    assert actual_call is None


def should_add_remaining_playback_time_to_next_song_change_timestamp(existing_playback, monkeypatch,
                                                                     fixed_track_length_ms, playback_service,
                                                                     requests_client, db_connection):
    start_time = datetime.datetime.now()
    delta_to_soon = datetime.timedelta(milliseconds=(fixed_track_length_ms - 1000))
    soon = datetime.datetime.now() + delta_to_soon
    soon_utc = datetime.datetime.now(datetime.timezone.utc) + delta_to_soon

    class MockDateTime:
        @classmethod
        def now(cls, tz_info=None):
            return soon if tz_info is None else soon_utc

    monkeypatch.setattr(datetime, "datetime", MockDateTime)
    queue_next_songs(playback_service)

    delta_to_soon = datetime.timedelta(milliseconds=fixed_track_length_ms)
    soon = datetime.datetime.now() + delta_to_soon
    soon_utc = datetime.datetime.now(datetime.timezone.utc) + delta_to_soon

    class MockDateTime:
        @classmethod
        def now(cls, tz_info=None):
            return soon if tz_info is None else soon_utc

    monkeypatch.setattr(datetime, "datetime", MockDateTime)
    queue_next_songs(playback_service)

    expected_delta = start_time + datetime.timedelta(milliseconds=(fixed_track_length_ms * 2))
    with db_connection.session() as session:
        playback_state: PlaybackSession = session.scalar(select(PlaybackSession))
    assert playback_state.next_song_change_timestamp - expected_delta < datetime.timedelta(milliseconds=10)
