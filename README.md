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

```json
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
```json
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

3. Edit the Program.cs to include hosting.json configuration
4. Edit the Startup.cs Configure function to mimic the following
```
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            
            if (env.IsDevelopment())
                {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true
                });
            }

            app.Use(async (context, next) => {
                await next();
                 if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value) && !context.Request.Path.Value.StartsWith("/api/")) {
                        context.Request.Path = "/index.html";
                        await next();
                    }
            });
            
            app.UseMvcWithDefaultRoute();
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
```
## Step 4 - Bringing it all together
1. Edit the package.json file to include the following
```
    "aspnet-prerendering": "^2.0.5",
    "aspnet-webpack": "^1.0.29",
     "html-webpack-plugin": "^2.28.0",
    "webpack-hot-middleware": "^2.12.2"
```
2. Run `npm install`
3. Edit the main.ts file within the Client folder to the match following.
```
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const rootElemTagName = 'app-root'; 

if (module['hot']) {
    module['hot'].accept();
    module['hot'].dispose(() => {
        const oldRootElem = document.querySelector(rootElemTagName);
        const newRootElem = document.createElement(rootElemTagName);
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        platformBrowserDynamic().destroy();
    });
} else {
    enableProdMode();
}

const platform = platformBrowserDynamic();
const bootApplication = () => { platform.bootstrapModule(AppModule); };
if (document.readyState === 'complete') {
    bootApplication();
} else {
    document.addEventListener('DOMContentLoaded', bootApplication);
}
```
4. Enter `dotnet run` 
5. You should have a blank starter Angular 4 .NET Core Web Api Application with Hot Module Replacement, Angular CLI functionality