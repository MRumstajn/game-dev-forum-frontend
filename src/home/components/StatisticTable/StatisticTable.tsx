import { Card, Link, Typography } from "@tiller-ds/core";

export type Statistic = {
  name: string;
  value: string;
  clickable: boolean;
  redirectLink?: string;
};

type StatisticCardProps = {
  statisticName: string;
  statistics: Statistic[];
};

export function StatisticCard({
  statisticName,
  statistics,
}: StatisticCardProps) {
  return (
    <Card className="p-5">
      <Card.Header>
        <Typography variant="h3" element="h3">
          {statisticName}
        </Typography>
      </Card.Header>
      <Card.Body>
        {statistics.map((stat) => (
          <div className="flex flex-row space-x-20 justify-between border-b mb-3">
            <Typography variant="text" element="p">
              {stat.clickable ? (
                <Link
                  to={stat.redirectLink}
                  tokens={{
                    color: {
                      main: "text-black",
                    },
                  }}
                >
                  {stat.name}
                </Link>
              ) : (
                stat.name
              )}
            </Typography>
            <Typography variant="text" element="p">
              <strong>{stat.value}</strong>
            </Typography>
          </div>
        ))}
        {statistics.length === 0 && (
          <Typography variant="subtext" element="p">
            No statistics
          </Typography>
        )}
      </Card.Body>
    </Card>
  );
}
