export type TDeployment = {
    ID: number,
    Name: string,
    RepoUrl: string,
    InstallCMD: string,
    BuildCMD: string,
    OutputDIR: string,
    ArnsProcess: string,
    DeploymentId: string,
    DeploymentHash: string
}

export type TDeployments = {
    [name: string]: TDeployment
}