export default function ShopLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {/* Header commun aux sous-pages */}
            <nav className="bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50">
                {/* Breadcrumbs + actions */}
                {children}
            </nav>
        </div>
    );
}