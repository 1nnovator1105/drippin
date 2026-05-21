import TagPage from "@/components/tag/TagPage";

export default function TagRoutePage({
  params,
}: {
  params: { tag: string };
}) {
  const tag = decodeURIComponent(params.tag);
  return <TagPage tag={tag} />;
}
