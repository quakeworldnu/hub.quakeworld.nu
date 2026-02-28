import { SecondaryButton } from "@qwhub/Buttons";
import { useEffect, useState } from "react";

export function KoFiGoal({ project, description, title }) {
  const [goalData, setGoalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoal() {
      try {
        const res = await fetch(
          `https://vendor.quake.world/v1/ko-fin?project=${project}`,
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setGoalData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGoal();
  }, [project]);

  if (loading || !goalData) return null;

  const { progress, goal, currency } = goalData;
  const kofinUrl = `https://ko-fi.com/${project}`;

  return (
    <div className="border border-slate-800 rounded-md p-4 bg-slate-800">
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="mt-2 text-gray-300">{description}</p>}

      <div className="mt-4">
        <div className="w-full h-1.5 bg-slate-600 rounded overflow-hidden">
          <div
            className="h-full bg-emerald-600"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-300 text-muted-foreground">
          {progress}% of {currency}
          {goal} goal
        </p>
      </div>

      <SecondaryButton className="p-2 mt-4 text-sm" href={kofinUrl}>
        Learn more
      </SecondaryButton>
    </div>
  );
}
