# AngularCLI-.NETCoreWebApi
An Angular 4 CLI Application with a .NET Core Web Api - Webpack 2 &amp; Hot Module Replacement Template

## Creating an Angular 4 Cli Application with .NET Core Web Api and Webpack 2 + Hot Module Replacement 

### Step 1 - Install Prerequisites
Make sure you have installed the latest version of Node.js, Angular CLI, Webpack 2

```
npm install -g @angular/cli@latest 
npm install -g webpack@latest
```

### Step 2 - Angular CLI Component
Generate a new Angular CLI application 

```
ng new demoapplication  --style=scss
```

1. cd into the directory you just created and rename the src folder to 'Client'
2. open the `.angular-cli.json` file and edit the 'root' to Client and outDir to "dist". Also, edit the lint.project to say Client instead of src
3. Type in `ng eject` in the root of your project. This will generate a webpack.config.js file
4. Open the webpack.config.js file and locate 'output'. Underneath the path add the following `"publicPath": "/wwwroot/"`

```
  "output": {
    "path": path.join(process.cwd(), "wwwroot"),
    "publicPath": "/wwwroot/",
    "filename": "[name].bundle.js",
    "chunkFilename": "[id].chunk.js"
 ```

## Step 3 - .NET Core Web Api Component
Generate a new .NET Core Web Api Application in the projects root directory

```
dotnet new webapi
```

1. Create a new hosting.json file in the projects root directory with the following contents
```
{
    "server.urls": "http://localhost:5000",
    "environment": "Development"
}
```
2. Edit the generated `.csproj` file to make it look like the following 
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>netcoreapp1.1</TargetFramework>
    <TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>
  </PropertyGroup>

  <ItemGroup>
    <Folder Include="wwwroot\" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore" Version="1.1.1" />
    <PackageReference Include="Microsoft.AspNetCore.Mvc" Version="1.1.2" />
    <PackageReference Include="Microsoft.AspNetCore.SpaServices" Version="1.1.0" />
    <PackageReference Include="Microsoft.AspNetCore.StaticFiles" Version="1.1.0" />
    <PackageReference Include="Microsoft.Extensions.Logging.Debug" Version="1.1.1" />
  </ItemGroup>

  <Target Name="RunWebpack" AfterTargets="ComputeFilesToPublish">
    <Exec Command="npm install" />
    <Exec Command="node node_modules/webpack/bin/webpack.js" />
  </Target>
</Project>
```
