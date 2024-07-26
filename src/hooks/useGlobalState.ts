import { TDeployment, TDeployments } from '@/types';
import { create } from 'zustand'

type Store = {
    managerProcess: string;
    deployments: TDeployment[];
    setManagerProcess: (managerProcess: string) => void
    setDeployments: (deployments: TDeployment[]) => void
}

export const useGlobalState = create<Store>()((set) => ({
    managerProcess: "",
    deployments: [],
    setManagerProcess: (managerProcess: string) => set({ managerProcess }),
    setDeployments: (deployments: TDeployment[]) => set({ deployments })
}))