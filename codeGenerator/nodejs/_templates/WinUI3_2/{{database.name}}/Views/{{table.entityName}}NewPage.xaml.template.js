`
<Page
    x:Class="${context.namespace}.${table.entityName}NewPage"
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
            Text="New ${table.entityName}" />

        <CommandBar
                x:Name="MainCommandBar"
                HorizontalAlignment="Stretch"
                Background="Transparent"
                DefaultLabelPosition="Right"
                RelativePanel.AlignRightWithPanel="True">
            <AppBarButton
                    Click="{x:Bind ViewModel.SaveAsync}"
                    Icon="Save"
                    Label="Save"
                    Visibility="{x:Bind ViewModel.IsInEdit, Mode=OneWay}"/>
        </CommandBar>

        <Grid x:Name="GridLayoutRoot"
                Margin="0,32,0,0"
                RelativePanel.AlignLeftWithPanel="True"
                RelativePanel.AlignRightWithPanel="True"
                RelativePanel.Below="PageTitle">
            <StackPanel Orientation="Vertical" >
                ${function a() {
                    var index = -1;
                    return table.fields.filter(field => field.IsVisible === true).map(field => { index ++; return `
                <StackPanel Orientation="Horizontal" Margin="0,24,0,0" >
                    <TextBlock Width="200" Grid.Column="1" Text="${field.humanReadableName || field.classMemberName.UpperCaseToHumanName()}${field.required === true ? " (*)" : ""}" Margin="10" HorizontalAlignment="Left" VerticalAlignment="Center" />
                    <AutoSuggestBox
                            x:Name="AutoSuggestBox_${field.classMemberName}"
                            MinWidth="200"
                            Width="auto"
                            Loaded="AutoSuggestBox_${field.classMemberName}_Loaded"
                            TextChanged="AutoSuggestBox_${field.classMemberName}_TextChanged"
                            SuggestionChosen="AutoSuggestBox_${field.classMemberName}_SuggestionChosen"
                            QuerySubmitted="AutoSuggestBox_${field.classMemberName}_QuerySubmitted"
                        >
                    </AutoSuggestBox>
                </StackPanel>
                `
                }).join("")} ()}
            </StackPanel>
        </Grid>                    
    </RelativePanel>
</Page>
`


