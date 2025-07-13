import { useParams } from "react-router-dom";

export default function SingleVenue() {
  const { id } = useParams();
  return (
    <div className="p-10">
      <h1 className="text-3xl font-heading">Venue details</h1>
      <p>Details for venue with ID: {id} will be displayed here.</p>
    </div>
  );
}
