// frontend/components/dashboard/WelcomeCard.tsx
interface WelcomeCardProps {
    name: string;
}

export default function WelcomeCard({ name }: WelcomeCardProps) {
    return (
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
            <h2 className="text-2xl font-bold">Welcome, {name}!</h2>
            <p className="text-blue-100 mt-1">Your financial journey starts here. Let's review your performance.</p>
        </div>
    );
}