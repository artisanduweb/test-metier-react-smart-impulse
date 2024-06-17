import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { projectId } = useParams();
  // Use tanstack query to fetch project data based on projectId 
  // invalidation/loading/error handling

  return (
    <div>
      <h1>Project Page</h1>
      <p>Project ID: {projectId}</p>
      {/* TODO: Render project details */}
    </div>
  );
};

export {ProjectDetail};