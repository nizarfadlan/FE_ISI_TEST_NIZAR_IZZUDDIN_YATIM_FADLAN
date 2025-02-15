import EditUserClient from "./edit-user";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditUserClient id={id} />;
}
