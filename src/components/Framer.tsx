import { motion, type Variants } from "framer-motion";
import type { FC, ReactNode } from "react";

interface FadeInSectionProps {
  children: ReactNode;
}

const FadeInSection: FC<FadeInSectionProps> = ({ children }) => {
  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
