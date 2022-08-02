`
<Page
    x:Class="${context.namespace}.SettingsPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:muxc="using:Microsoft.UI.Xaml.Controls"
    xmlns:p="using:${projectName}" 
    mc:Ignorable="d">
    <Grid>
        <StackPanel Orientation="Vertical">

            <TextBlock x:Name="PageTitle"
                Style="{StaticResource PageTitleTextBlockStyle}"
                Text="Settings" />

            <muxc:RadioButtons Header="Data source" SelectedIndex="2">
                <RadioButton Checked="OnDataSourceChanged" x:Name="SqliteRadio" Tag="Sqlite">Sqlite (Local)</RadioButton>
                <RadioButton Checked="OnDataSourceChanged" x:Name="RestRadio" Tag="Rest">REST (Azure)</RadioButton>
            </muxc:RadioButtons>

            <!-- Code generator -->
            <TextBox Margin="0,24,24,0" x:Name="settingUserName" Tag="userName" Header="User Name" Text="{x:Bind p:Settings.Default.userName, Mode=TwoWay}"  Width="300" HorizontalAlignment="Left"/>
            <TextBox Margin="0,24,24,0" x:Name="settingVaribaleName" Tag="variableName" Header="Variable Name" Text="{x:Bind p:Settings.Default.variableName, Mode=TwoWay}" Width="300" HorizontalAlignment="Left"/>
            <!-- /Code generator -->

            <HyperlinkButton
                x:Name="PrivacyButton"
                Margin="0,25,0,0"
                Click="OnPrivacyButtonClick"
                Content="Privacy statement" />
            <HyperlinkButton
                x:Name="LicenseButton"
                Click="OnLicenseButtonClick"
                Content="Additional license terms" />
            <HyperlinkButton
                x:Name="GitHubButton"
                Click="OnCodeButtonClick"
                Content="GitHub repository" />

            <Button x:Name="buttonSave" Click="OnButtonSaveClick" HorizontalAlignment="Left">
                <TextBlock Margin="5,0">Save</TextBlock>
            </Button>
        
        </StackPanel>

        <VisualStateManager.VisualStateGroups>
            <VisualStateGroup>
                <VisualState>
                    <VisualState.StateTriggers>
                        <AdaptiveTrigger MinWindowWidth="{StaticResource LargeWindowSnapPoint}" />
                    </VisualState.StateTriggers>
                </VisualState>
                <VisualState>
                    <VisualState.StateTriggers>
                        <AdaptiveTrigger MinWindowWidth="{StaticResource MediumWindowSnapPoint}" />
                    </VisualState.StateTriggers>
                </VisualState>
                <VisualState>
                    <VisualState.StateTriggers>
                        <AdaptiveTrigger MinWindowWidth="{StaticResource MinWindowSnapPoint}" />
                    </VisualState.StateTriggers>
                    <VisualState.Setters>
                        <Setter Target="PageTitle.Margin" Value="64,4,0,0"/>
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
        </VisualStateManager.VisualStateGroups>
    </Grid>
</Page>
`