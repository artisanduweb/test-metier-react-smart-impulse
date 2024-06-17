import { useQuery } from '@tanstack/react-query';

const fetchProjects = async () => {
  const response = await fetch('/api/projects');
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

export const useQueryProjects = () => useQuery({
    queryKey: 'projects',
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const fetchEnergy = async (uuid) => {
    const response = await fetch(`/api/energy?uuid=${uuid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch energy data');
    }
    return response.json();
  }

  export const useQueryEnergy = (uuid) => useQuery({
    queryKey: ['energy', uuid],
    queryFn: () => fetchEnergy(uuid),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  