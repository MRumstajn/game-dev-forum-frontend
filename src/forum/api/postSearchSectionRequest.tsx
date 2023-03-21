import { SearchSectionRequest } from "./SearchSectionRequest";
import { SectionResponse } from "../../common/api/SectionResponse";
import { CATEGORY_SEARCH_URL } from "../../common/Routes";

export async function postSearchSectionRequest(
  request: SearchSectionRequest
): Promise<SectionResponse> {
  const response = await fetch(CATEGORY_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
