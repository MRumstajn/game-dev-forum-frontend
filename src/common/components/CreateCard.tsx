import { Card, Typography } from "@tiller-ds/core";
import { Icon } from "@tiller-ds/icons";

type CreateCardProps = {
  label: string;
  clickCallback(): void;
};

export function CreateCard({ label, clickCallback }: CreateCardProps) {
  return (
    <div className="cursor-pointer" onClick={() => clickCallback()}>
      <Card className="border border-gray-500 bg-transparent">
        <Card.Body>
          <div className="flex flex-col gap-y-3 justify-center items-center">
            <Icon type="plus-circle" className="text-gray-500" />
            <Typography variant="subtext" element="p">
              {label}
            </Typography>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
