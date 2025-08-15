function SidebarRoot({ children }: { children: React.ReactNode }) {

    return (
        <div className={`w-1/5 bg-gray-200 p-4 py-8 gap-2 flex-col flex`}>
            {children}
        </div>
    )
}

export default SidebarRoot;