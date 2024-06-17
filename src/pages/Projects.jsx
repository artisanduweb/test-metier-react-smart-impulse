import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useQueryProjects } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProjectCard = ({ uuid, name, timezone }) => {
  const navigate = useNavigate()

  return <Card
    key={uuid}
    className="project-card"
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-slate-800">Timezone: <span className="italic">{timezone}</span></CardContent>
      <CardFooter>
        <Button onClick={() => navigate(`/project/${uuid}`)}>View Project</Button>
      </CardFooter>
    </Card>
};

export const Projects = () => {
  const { data: projectsList, loading, error } = useQueryProjects();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="projects grid grid-cols-2 gap-4">
      {projectsList && projectsList.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};
