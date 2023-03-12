import { useParams } from "react-router-dom";

export function Thread() {
  const params = useParams();

  return (
    <>
      <h1>{params.id}</h1>
    </>
  );
}
