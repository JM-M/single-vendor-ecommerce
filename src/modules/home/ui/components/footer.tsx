import { siteConfig } from "@/site.config";

const Footer = () => {
  return (
    <footer className="flex justify-between border-t p-6 font-medium">
      <div className="flex items-center gap-2">
        <p>{siteConfig.name}, Inc.</p>
      </div>
    </footer>
  );
};
export default Footer;
