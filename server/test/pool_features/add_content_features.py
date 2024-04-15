from unittest.mock import Mock

from sqlalchemy import select, and_

from api.pool.models import PoolContent
from database.entities import PoolMember


def should_create_a_pool_member_for_user_even_if_user_pool_is_empty(create_mock_track_search_result,
                                                                    requests_client_get_queue,
                                                                    build_success_response, test_client,
                                                                    valid_token_header, validate_response):
    track = create_mock_track_search_result()
    requests_client_get_queue.append(build_success_response(track))
    pool_content_data = PoolContent(spotify_uri=track["uri"]).model_dump()

    response = test_client.post("/pool/content", json=pool_content_data, headers=valid_token_header)

    pool_response = validate_response(response)
    assert len(pool_response["users"][0]["tracks"]) == 1


def should_propagate_errors_from_spotify_api(create_mock_track_search_result, test_client, valid_token_header,
                                             validate_response, spotify_error_message):
    track = create_mock_track_search_result()
    pool_content_data = PoolContent(spotify_uri=track["uri"]).model_dump()

    response = test_client.post("/pool/content", json=pool_content_data, headers=valid_token_header)

    json_data = validate_response(response, 502)
    assert json_data["detail"] == (f"Error code {spotify_error_message.code} received while calling Spotify API. "
                                   f"Message: {spotify_error_message.message}")


def should_save_the_pool_member_to_database_even_if_user_pool_is_empty(create_mock_track_search_result,
                                                                       requests_client_get_queue, test_client,
                                                                       build_success_response,  valid_token_header,
                                                                       db_connection, logged_in_user_id):
    track = create_mock_track_search_result()
    requests_client_get_queue.append(build_success_response(track))
    pool_content_data = PoolContent(spotify_uri=track["uri"]).model_dump()

    test_client.post("/pool/content", json=pool_content_data, headers=valid_token_header)

    with db_connection.session() as session:
        actual_pool_content = session.scalar(select(PoolMember).where(PoolMember.user_id == logged_in_user_id))
    assert actual_pool_content is not None


def should_preserve_existing_pool_members_on_new_member_addition(create_mock_track_search_result, test_client,
                                                                 requests_client_get_queue, build_success_response,
                                                                 valid_token_header, db_connection, logged_in_user_id,
                                                                 existing_pool):
    track = create_mock_track_search_result()
    requests_client_get_queue.append(build_success_response(track))
    pool_content_data = PoolContent(spotify_uri=track["uri"]).model_dump()

    test_client.post("/pool/content", json=pool_content_data, headers=valid_token_header)

    with db_connection.session() as session:
        actual_pool_content = session.scalars(
            select(PoolMember).where(PoolMember.user_id == logged_in_user_id)).unique().all()
    assert len(actual_pool_content) == len(existing_pool) + 1


def should_correctly_construct_pool_after_collection_addition(requests_client_get_queue,
                                                              build_success_response, test_client,
                                                              valid_token_header, db_connection, logged_in_user_id,
                                                              existing_pool, create_mock_playlist_fetch_result,
                                                              validate_response):
    playlist = create_mock_playlist_fetch_result(35)
    requests_client_get_queue.append(build_success_response(playlist))
    pool_content_data = PoolContent(spotify_uri=playlist["uri"]).model_dump()

    response = test_client.post("/pool/content", json=pool_content_data, headers=valid_token_header)

    with db_connection.session() as session:
        actual_pool_content = session.scalars(select(PoolMember).where(
            and_(PoolMember.user_id == logged_in_user_id, PoolMember.parent_id == None))).unique().all()
    assert len(actual_pool_content) == len(existing_pool) + 1
    pool_response = validate_response(response)
    user_pool = pool_response["users"][0]
    assert len(user_pool["collections"][0]["tracks"]) == len(playlist["tracks"]["items"])


def should_use_collection_icon_as_track_icon_on_collection_addition(create_mock_track_search_result, valid_token_header,
                                                                    build_success_response, test_client,
                                                                    existing_pool, requests_client_get_queue,
                                                                    create_mock_artist_search_result,
                                                                    create_mock_album_search_result, validate_response):
    artist = create_mock_artist_search_result()
    tracks = [create_mock_track_search_result(artist) for _ in range(8)]
    album = create_mock_album_search_result(artist, tracks)
    requests_client_get_queue.append(build_success_response(album))
    pool_content_data = PoolContent(spotify_uri=album["uri"]).model_dump()

    response = test_client.post("/pool/content", json=pool_content_data, headers=valid_token_header)

    pool_response = validate_response(response)
    user_pool = pool_response["users"][0]
    for track in user_pool["collections"][0]["tracks"]:
        assert track["spotify_icon_uri"] == album["images"][0]["url"]


def should_include_current_token_in_response_headers(create_mock_track_search_result, requests_client_get_queue,
                                                     build_success_response, test_client, valid_token_header,
                                                     assert_token_in_headers):
    track = create_mock_track_search_result()
    requests_client_get_queue.append(build_success_response(track))
    pool_content_data = PoolContent(spotify_uri=track["uri"]).model_dump()

    response = test_client.post("/pool/content", json=pool_content_data, headers=valid_token_header)

    assert_token_in_headers(response)
