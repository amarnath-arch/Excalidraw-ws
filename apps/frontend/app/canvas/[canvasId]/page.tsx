import ChildCanvas from "@/components/ChildCanvas";

export default async function CanvasRoot({
  params,
}: {
  params: {
    canvasId: string;
  };
}) {
  const roomId = (await params).canvasId;

  console.log(roomId);

  return <ChildCanvas roomId={roomId} />;
}
