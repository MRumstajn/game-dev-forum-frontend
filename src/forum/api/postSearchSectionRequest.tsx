import { SearchSectionRequest } from "./SearchSectionRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { SectionResponse } from "../../common/api/SectionResponse";
import { SECTION_SEARCH_URL } from "../../common/Routes";

export async function postSearchSectionRequest(
  request: SearchSectionRequest
): Promise<BaseResponseWrapper<SectionResponse[]>> {
  const response = await fetch(SECTION_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<SectionResponse[]>;
}
