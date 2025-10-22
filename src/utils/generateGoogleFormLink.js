const generateGoogleFormLink = ({
  email,
  taskId,
  taskTitle,
  currentTaskStatus,
}) => {
  console.log({
    email,
    taskId,
    taskTitle,
    currentTaskStatus,
  });
  const baseUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfO4wfElBBWjO3wRQqSPnVTta3NXFvPXa5cs0QIZc1r8z5Jdw/viewform?usp=pp_url";
  const params = new URLSearchParams({
    "entry.1138713563": taskId, // Hidden Task ID field
    "entry.1346351159": taskTitle, // Task Title field
    "entry.1505231283": currentTaskStatus, // Subtask Name field
    "entry.1858239940": "",
  });
  return `${baseUrl}?${params.toString()}`;
};

export { generateGoogleFormLink };
