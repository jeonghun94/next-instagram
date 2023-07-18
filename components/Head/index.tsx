import NextHead from "next/head";

interface HeadProps {
  pageTitle?: string;
}

const Head = ({ pageTitle }: HeadProps) => {
  const title = `${pageTitle ? `${pageTitle} • Instagram` : ""}  Instagram`;
  return (
    <NextHead>
      <title>{title}</title>
      <link
        data-default-icon="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
        href="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
        type="image/x-icon"
        rel="shortcut icon"
      />
    </NextHead>
  );
};

export default Head;
