/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";

const FeatureCard = ({ feature }) => {
  const { icon, title, description } = feature;

  return (
    <Card className="hover:shadow-xl transition rounded-2xl">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="icon text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
