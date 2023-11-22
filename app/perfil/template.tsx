import DenseAppBar from "../components/appMenuBar";

export default function Template({ children }: { children: React.ReactNode }) {
    return <>
    <DenseAppBar />
    {children}</>
  }