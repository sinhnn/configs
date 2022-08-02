`
<Page
    x:Class="${context.namespace}.${table.entityName}DetailPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:vm="using:${projectName}.${database.name}"
    xmlns:lvm="using:${projectName}.${database.name}.ViewModels"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:muxc="using:Microsoft.UI.Xaml.Controls"
    xmlns:toolkit="using:CommunityToolkit.WinUI.UI.Controls"
    xmlns:controls="using:CommunityToolkit.WinUI.UI.Controls.Primitives"
    NavigationCacheMode="Required"
    mc:Ignorable="d">

    <Page.Resources>

    </Page.Resources>

    <RelativePanel x:Name="LayoutRoot" >
        <TextBlock
            x:Name="PageTitle"
            Style="{StaticResource PageTitleTextBlockStyle}"
            Text="{x:Bind ViewModel.Name, Mode=OneWay}" />

        <Grid x:Name="GridLayoutRoot"
                RelativePanel.AlignLeftWithPanel="True"
                RelativePanel.AlignRightWithPanel="True"
                RelativePanel.Below="PageTitle">
            <StackPanel Orientation="Vertical" >
                ${function a() {
                    var index = -1;
                    return table.fields.map(field => { index ++; return `
                <StackPanel Orientation="Horizontal" >
                    <TextBlock Width="200" Grid.Column="1" Text="${field.humanReadableName || field.classMemberName.UpperCaseToHumanName()}" Margin="10" HorizontalAlignment="Left" VerticalAlignment="Center" />
                    <TextBox MinWidth="200" Width="auto" x:Name="TextBox_${field.classMemberName}" Grid.Column="2" Margin="10" Text="{x:Bind ViewModel.${field.classMemberName}, Mode=OneWay}" />
                </StackPanel>
                `
                }).join("")} ()}
            </StackPanel>
        </Grid>                    
    </RelativePanel>
</Page>
`


