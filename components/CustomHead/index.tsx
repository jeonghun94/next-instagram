import Head from "next/head";

interface HeadProps {
  pageTitle?: string;
}

const CustomHead = ({ pageTitle }: HeadProps) => {
  const title = `${pageTitle ? `${pageTitle} • Instagram` : ""}  Instagram`;
  return (
    <Head>
      <title>{title}</title>
      <link
        data-default-icon="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
        href="https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico"
        type="image/x-icon"
        rel="shortcut icon"
      />
    </Head>
  );
};

export default CustomHead;
