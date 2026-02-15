import React from 'react';
import { AlertTriangle } from 'lucide-react';

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Unhandled UI error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
                    <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center">
                            <AlertTriangle className="text-red-300" size={28} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">Something Went Wrong</h1>
                        <p className="text-gray-300 text-sm mb-6">
                            The page crashed unexpectedly. Reload to continue.
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs tracking-widest uppercase"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
