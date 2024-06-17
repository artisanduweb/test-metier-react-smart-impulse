import { EnergyChart } from '@/features/EnergyCharts';
import { useQueryProjects, useQueryEnergy } from '@/hooks';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { data: projectsList, isLoading } = useQueryProjects();
  const queryEnergy = useQueryEnergy(projectId);

  const currentProject = useMemo(() => {
    return projectsList ? projectsList.find((project) => project.uuid === projectId) : []
  }, [projectId, projectsList])

  if (isLoading || queryEnergy.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold border-b">{currentProject?.name}</h2>
      <p>Project ID: {projectId}</p>
     {queryEnergy.data.length ? <EnergyChart data={queryEnergy.data} /> : null}
    </div>
  );
};

export {ProjectDetail};
