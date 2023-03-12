import { Card, Link, Typography } from "@tiller-ds/core";

type NewsCardProps = {
  id: number;

  title: string;

  creationDate: Date;

  author: string;
};

export function NewsCard({ id, title, creationDate, author }: NewsCardProps) {
  const formatDate = (date: Date): string => {
    return date.toLocaleString("local", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link to={`/news/${id}`}>
      <Card>
        <Card.Body className="flex flex-row justify-between">
          <Typography variant="text" element="p">
            {title}
          </Typography>
          <div className="flex flex-col space-y-3">
            <Typography variant="text" element="p">
              {formatDate(creationDate)}
            </Typography>
            <Typography variant="text" element="p">
              by {author}
            </Typography>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}
