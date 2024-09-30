interface PageProps {
  params: {
    username: string;
    postSlug: string;
  };
}

const CarPage = ({ params }: PageProps) => {
  return <div>Post details</div>;
};

export default CarPage;
