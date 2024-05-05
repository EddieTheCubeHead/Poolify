from unittest.mock import Mock

import httpx
import pytest
from starlette.testclient import TestClient

from test_types.callables import CreateSearchResponse, MockPlaylistSearchResult, CreatePaginatedSearchResult, \
    BuildSuccessResponse, ValidateResponse, ValidatePaginatedResultLength
from test_types.typed_dictionaries import Headers


@pytest.fixture
def create_playlist_paginated_search(create_mock_playlist_search_result: MockPlaylistSearchResult,
                                     create_paginated_search_result: CreatePaginatedSearchResult,
                                     build_success_response: BuildSuccessResponse) -> CreateSearchResponse:
    def wrapper(query: str, limit: int = 20) -> httpx.Response:
        playlists = [create_mock_playlist_search_result() for _ in range(limit)]
        return_json = {
            "playlists": create_paginated_search_result(query, limit, playlists)
        }
        return build_success_response(return_json)

    return wrapper


def should_get_twenty_playlists_by_default(test_client: TestClient, valid_token_header: Headers, requests_client: Mock,
                                           validate_response: ValidateResponse,
                                           validate_paginated_result_length: ValidatePaginatedResultLength,
                                           create_playlist_paginated_search: CreateSearchResponse):
    query = "my query"
    requests_client.get = Mock(return_value=create_playlist_paginated_search(query))
    result = test_client.get(f"/search/playlists?query={query}", headers=valid_token_header)
    search_result = validate_response(result)
    validate_paginated_result_length(search_result)


def should_query_spotify_for_playlists_with_provided_query_string(
        test_client: TestClient, valid_token_header: Headers, requests_client: Mock,
        create_playlist_paginated_search: CreateSearchResponse):
    query = "my query"
    requests_client.get = Mock(return_value=create_playlist_paginated_search(query))
    test_client.get(f"/search/playlists?query={query}", headers=valid_token_header)
    full_query = f"https://api.spotify.com/v1/search?q={query}&type=playlist&offset=0&limit=20"
    requests_client.get.assert_called_with(full_query, headers=valid_token_header)


def should_return_less_results_if_twenty_not_found(test_client: TestClient, valid_token_header: Headers,
                                                   validate_response: ValidateResponse, requests_client: Mock,
                                                   validate_paginated_result_length: ValidatePaginatedResultLength,
                                                   create_playlist_paginated_search: CreateSearchResponse):
    expected_result_count = 7
    query = "my query"
    requests_client.get = Mock(return_value=create_playlist_paginated_search(query, expected_result_count))
    result = test_client.get(f"/search/playlists?query={query}", headers=valid_token_header)
    search_result = validate_response(result)
    validate_paginated_result_length(search_result, expected_result_count)


def should_use_offset_and_limit_if_provided(test_client: TestClient, valid_token_header: Headers, requests_client: Mock,
                                            create_playlist_paginated_search: CreateSearchResponse,
                                            validate_response: ValidateResponse,
                                            validate_paginated_result_length: ValidatePaginatedResultLength):
    offset = 20
    limit = 10
    query = "my query"
    requests_client.get = Mock(return_value=create_playlist_paginated_search(query, limit))
    result = test_client.get(f"/search/playlists?query={query}&offset={offset}&limit={limit}", headers=valid_token_header)
    full_query = f"https://api.spotify.com/v1/search?q={query}&type=playlist&offset={offset}&limit={limit}"
    requests_client.get.assert_called_with(full_query, headers=valid_token_header)
    search_result = validate_response(result)
    validate_paginated_result_length(search_result, limit)
