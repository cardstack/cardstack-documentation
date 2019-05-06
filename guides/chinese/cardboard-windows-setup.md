在使用windows系统进行Cardboard编译时,由于系统的差异性,可能会出现一系统的安装问题,本文档提供一套相对完善的安装示例，并在最大程度上对一些问题进行了规避，使开发者能快速完成平台的运行

## 示例系统环境
 + windows系统版本 *Windows 10 X64 Version 1809(OS Build 17763.107)*
 + NodeJS版本 *node-v10.15.3-x64*
 + Python版本 *2.7.15*
 + Visual Studio版本 *visual studio 2015*
 + Docker 版本  *18.09.2*
 
## 安装windows build工具
 **安装此工具之前,请确认系统已经安装.Net Framework 4.5以上版本或者[下载](https://www.microsoft.com/en-us/download/details.aspx?id=55170)安装最新的版本**</br>
 以管理员方式开启一个powerShell,并切换目录到项目路径的cardboard模块下,并执行安装命令
 
```sh
PS C:\Windows\system32> cd d:\cardboard\
PS D:\cardboard> cd .\cardboard\
PS D:\cardboard\cardboard> npm install --global --production windows-build-tools
```

这此步骤中,很有可能出现安装异常情况,如果你在运行中出现此情况,接下来就需要手动进行安装

![异常错误](/images/chinese/windows/error_download.png)

1. [下载python 2.7.15](https://www.python.org/downloads/release/python-2715/) (必须下载2.7.x版本,3.x无法运行)
2. [下载vs_buildTools.exe](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Professional&rel=15) (此步骤需要开梯子才能打开)

使用win + r键打开运行窗口,输入 %userprofile% 并找到.windows-build-tools文件夹,将下载好的两个文件拷贝进去,再次执行windows build安装命令,如果依然无法执行完命令,请直接查看本文档最后一节*错误解决*,在解决了安装问题后,才可以进行下面的步骤

以下为安装成功截图

![安装成功](/images/chinese/windows/install_build_tools.png)

## 添加VCTargetsPath系统环境变量

![设置系统环境变量](/images/chinese/windows/set_environment_variables.png)


## 安装node模组

此步骤需要提前开启梯子,不然会出现安装失败,整个安装过程大概需要5-30分钟

在PowerShell中运行`yarn install`命令

![安装成功](/images/chinese/windows/yarn_install.png)

## 运行数据库PostgreSQL
 此功能需要在Docker进行运行,Cardboard已经设置好了相关的配置,此步骤只需要`yarn start-prereqs`这个命令就可以完成操作
 

## 运行Cardboard
在数据库运行成功后,使用`yarn start`来启动整个程序,等待程序自动构建完成后,通过[localhost:4200](localhost:4200)访问应用

以下为构建完成截图

![构建完成](/images/chinese/windows/build_success.png)

## 错误解决
### 无法使用windows-build-tools完成安装的解决办法
1. 双击执行python-2.7.15.amd64.msi,选中添加环境变量,然后安装

![构建完成](/images/chinese/windows/python_install.png)
 
2. 安装Build Tools 2015

[下载](https://www.microsoft.com/en-us/download/confirmation.aspx?id=48159) Build Tools2015工具(此步骤需要梯子),执行无任何选项,下一步就行了

3. 使用vs_BuildTools.exe安装其它组件
 
打开%userprofile%/.windows-build-tools,双击执行vs_BuildTools.exe,根据下图勾选的组件进行安装

![vs_build_tools2017](/images/chinese/windows/build_tools2017_5.png)
 
4. 在PowerShell中再次运行`yarn install`命令,即可完成安装
### MSB4019错误
执行 yarn install,可能出现 X:\\Microsoft.Cpp.Default.props找不到的情况,此步骤为未设置VCTargetsPath环境

 ![vs_build_tools2017](/images/chinese/windows/default_props_not_found.png)
