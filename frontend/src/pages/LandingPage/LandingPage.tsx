import React from 'react';
import { motion, Variants } from 'framer-motion';
import './LandingPage.css';

const layerVariants: Variants = {
    hover: (i: number) => ({
        scale: 1.05,
        transition: { delay: i * 0.1 }
    }),
    initial: {
        scale: 1
    }
    };

    const LandingPage: React.FC = () => {
    const layers = [1, 2, 3, 4, 5];

    return (
        <div className="container">
        {layers.map((_, i) => (
            <motion.div
            key={i}
            className={`layer layer${i + 1}`}
            custom={i}
            variants={layerVariants}
            initial="initial"
            whileHover="hover"
            />
        ))}
        </div>
    );
    };

export default LandingPage;
