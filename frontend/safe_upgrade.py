import os

filepath = r"E:\Scam Detection System\frontend\src\pages\LandingPage.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# We know the exact string to replace because it's the original file now
old_block = """// Simple fade-up animation for sections as they scroll into view
const FadeUpSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  );
};"""

new_block = """// High-end parallax reveal for sections
const ParallaxRevealSection = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.3 1"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className="w-full flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  );
};"""

if old_block in content:
    content = content.replace(old_block, new_block)
    content = content.replace("<FadeUpSection>", "<ParallaxRevealSection>")
    content = content.replace("</FadeUpSection>", "</ParallaxRevealSection>")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully upgraded LandingPage.tsx")
else:
    print("Could not find the block to replace!")
