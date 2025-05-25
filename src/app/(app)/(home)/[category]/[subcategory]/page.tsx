interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}
const CategoryPage = async ({ params }: Props) => {
  const { category, subcategory } = await params;

  return (
    <div>
      Category: {category} <br />
      Subcategory: {subcategory}
    </div>
  );
};
export default CategoryPage;
