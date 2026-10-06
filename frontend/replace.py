import os
import re

filepath = r"E:\Scam Detection System\frontend\src\pages\LandingPage.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# The regex matches the FadeUpSection block
pattern = re.compile(r"const FadeUpSection = \({ children }: { children: React\.ReactNode }\) => \{.*?\};\s*", re.DOTALL)

replacement = """const ParallaxRevealSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
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
};
"""

new_content = pattern.sub(replacement, content)
with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replaced!")
