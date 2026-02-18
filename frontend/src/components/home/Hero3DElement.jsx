import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Hero3DElement = () => {
    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        </div>
    );
};

export default Hero3DElement;
