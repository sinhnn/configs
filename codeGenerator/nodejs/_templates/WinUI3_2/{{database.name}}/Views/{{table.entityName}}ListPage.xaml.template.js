`
<Page
    x:Class="${context.namespace}.${table.entityName}ListPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:vm="using:${projectName}.${database.name}"
    xmlns:lvm="using:${projectName}.Common.ViewModels"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:muxc="using:Microsoft.UI.Xaml.Controls"
    xmlns:toolkit="using:CommunityToolkit.WinUI.UI.Controls"
    xmlns:controls="using:CommunityToolkit.WinUI.UI.Controls.Primitives"
    KeyDown="Page_KeyDown"
    NavigationCacheMode="Required"
    mc:Ignorable="d">

    <Page.Resources>
        <MenuFlyout x:Key="DataGridContextMenu">
            ${table.contextMenu.map(m => `
            <MenuFlyoutItem
                Click="${m.name.ToCapitalizeCase()}_Click"
                Text="${m.name}"
                Icon="${m.icon}">
            </MenuFlyoutItem>`).join("")}
        </MenuFlyout>
    </Page.Resources>

    <RelativePanel x:Name="LayoutRoot">
        <StackPanel x:Name="PageTitleStack">
            <TextBlock
                    x:Name="PageTitle"
                    Style="{StaticResource PageTitleTextBlockStyle}"
                    Text="${table.entityName}"/>
            <StackPanel x:Name="SubPageTitleStack" Orientation="Horizontal" >
                    <TextBox
                            x:Name="DataPath"
                            IsReadOnly="True"
                            BorderThickness="0"
                            Text=""/>
                    <ProgressRing x:Name="progressRing1"
                                  IsActive="{x:Bind ViewModel.IsLoading, Mode=OneWay}"/>
            </StackPanel>
        </StackPanel>

        <CommandBar
                x:Name="MainCommandBar"
                HorizontalAlignment="Stretch"
                Background="Transparent"
                DefaultLabelPosition="Right"
                RelativePanel.LeftOf="SearchStackPannel"
                RelativePanel.RightOf="PageTitleStack">
            <AppBarButton
                    Click="ViewDetails_Click"
                    Icon="Contact"
                    IsEnabled="{x:Bind lvm:Converters.IsNotNull(ViewModel.SelectedItem), Mode=OneWay}"
                    Label="View details"
                    ToolTipService.ToolTip="View details" />
            <AppBarSeparator/>
            <AppBarButton
                    Click="Create${table.entityName}_Click"
                    Icon="Add"
                    Label="New"
                    ToolTipService.ToolTip="New ${table.entityName}" />
            <AppBarButton
                    Click="Import${table.entityName}_Click"
                    Icon="Add"
                    Label="Import"
                    ToolTipService.ToolTip="Import ${table.entityName}" />
            <AppBarButton
                    Click="Export${table.entityName}_Click"
                    Icon="Add"
                    Label="Export"
                    ToolTipService.ToolTip="Export ${table.entityName}" />                    
            <!--<AppBarButton
                    Click="{x:Bind ViewModel.Sync}"
                    Icon="Refresh"
                    Label="Sync"
                    ToolTipService.ToolTip="Sync with server" />-->
        </CommandBar>

        <StackPanel x:Name="SearchStackPannel"
                     RelativePanel.AlignRightWithPanel="True"
                    Orientation="Horizontal"
                    MinWidth="100" 
                    >
            <!--<ComboBox x:Name="searchBy" MinWidth="100" 
                    ItemsSource="{x:Bind SearchFields}"
                    SelectedIndex="0"
                    VerticalAlignment="Bottom"
                    />-->
            <!--<uc:CollapsibleSearchBox
                x:Name="SearchBox"
                Width="240"
                Margin="12,8,12,0"
                CollapseWidth="{StaticResource LargeWindowSnapPoint}"
                Loaded="SearchBox_Loaded"
               />-->
        </StackPanel>                        
        <Grid
                Margin="0,10,0,0"
                RelativePanel.AlignLeftWithPanel="True"
                RelativePanel.AlignRightWithPanel="True"
                RelativePanel.Below="PageTitleStack">

            <toolkit:DataGrid
                    CanUserReorderColumns="True"
                    CanUserResizeColumns="True"
                    AutoGenerateColumns="False"
                    Sorting="DataGrid_Sorting"
                    BorderThickness="0"
                    GridLinesVisibility="All"
                    x:Name="${table.entityName.ToVariableName()}DataGrid"
                    ItemsSource="{x:Bind ViewModel.FilteredList}"
                    SelectedItem="{x:Bind ViewModel.SelectedItem, Mode=TwoWay}"
                    SelectionMode="Extended"
                    KeyDown="DataGrid_KeyDown"
                    RightTapped="DataGrid_RightTapped"
                    DoubleTapped="DataGrid_DoubleTapped"
                    ContextFlyout="{StaticResource DataGridContextMenu}">

                
                <toolkit:DataGrid.Resources>

                    <x:String x:Key="SortIconAscending">&#xE74A;</x:String>
                    <x:String x:Key="SortIconDescending">&#xE74B;</x:String>
                    
                    <Style TargetType="TextBlock" x:Key="DataGridColumn_CellTemplate_Style">
                        <Setter Property="HorizontalAlignment" Value="Stretch" />
                        <Setter Property="HorizontalTextAlignment" Value="Left" />
                        <Setter Property="IsTextSelectionEnabled" Value="False" />
                        <Setter Property="VerticalAlignment" Value="Center" />
                        <Setter Property="Margin" Value="10,5,6,6" />
                    </Style>

                    <Style TargetType="TextBox" x:Key="DataGridColumn_CellEditingTemplate_Style">
                        <Setter Property="HorizontalAlignment" Value="Stretch" />
                        <Setter Property="HorizontalTextAlignment" Value="Center" />
                        <Setter Property="VerticalAlignment" Value="Center" />
                        <Setter Property="Margin" Value="10,5,6,6" />
                    </Style>

                    <Style TargetType="ComboBox" x:Key="DataGridColumnHeader_ComboBox_Style">
                        <Setter Property="Width" Value="100" />
                        <Setter Property="BorderThickness" Value="0" />
                        <Setter Property="BorderBrush" Value="Black" />
                        <Setter Property="HorizontalAlignment" Value="Center" />
                        <Setter Property="VerticalAlignment" Value="Stretch" />
                        <Setter Property="CornerRadius" Value="0" />
                    </Style>


                    <Style TargetType="AutoSuggestBox" x:Key="DataGridColumnHeader_AutoSuggestBox_Style">
                        <Setter Property="BorderThickness" Value="0" />
                        <Setter Property="BorderBrush" Value="Black" />
                        <Setter Property="VerticalAlignment" Value="Stretch" />
                        <Setter Property="HorizontalAlignment" Value="Stretch" />
                        <Setter Property="HorizontalContentAlignment" Value="Left" />
                        <Setter Property="PlaceholderText" Value="Filter..." />
                        <Setter Property="CornerRadius" Value="0" />
                    </Style>    

                    <Style TargetType="TextBox" x:Key="DataGridColumnHeader_AutoSuggestBox_TexboxStyle">
                        <Setter Property="BorderThickness" Value="0" />
                        <Setter Property="BorderBrush" Value="Black" />
                        <Setter Property="HorizontalAlignment" Value="Stretch" />
                        <Setter Property="HorizontalContentAlignment" Value="Left" />
                        <Setter Property="CornerRadius" Value="0" />
                    </Style>

                </toolkit:DataGrid.Resources>
                <toolkit:DataGrid.Columns>${table.fields.filter(f => f.dstLangType !== "byte[]").filter(f => f.IsVisible !== false).map(field => {
                    return `
                    <toolkit:DataGridTemplateColumn 
                        Tag="${field.classMemberName}"
                        IsReadOnly="${field.IsReadOnly === true ? 'True' : 'False'}"
                        ClipboardContentBinding="{Binding ${field.classMemberName}}"
                        Header="${field.humanReadableName || field.classMemberName.UpperCaseToHumanName()}">
                        <toolkit:DataGridTemplateColumn.HeaderStyle>
                            <Style TargetType="controls:DataGridColumnHeader">
                                <Setter Property="Template">
                                    <Setter.Value>
                                        <ControlTemplate TargetType="controls:DataGridColumnHeader">
                                            <Grid x:Name="ColumnHeaderRoot"  BorderThickness="0,0,1,0" BorderBrush="LightGray">
                                                <VisualStateManager.VisualStateGroups>
                                                    <VisualStateGroup x:Name="FocusStates">
                                                        <VisualState x:Name="Unfocused"/>
                                                        <VisualState x:Name="Focused">
                                                            <Storyboard>
                                                                <DoubleAnimation Storyboard.TargetName="FocusVisual" Storyboard.TargetProperty="Opacity" To="1" Duration="0"/>
                                                            </Storyboard>
                                                        </VisualState>
                                                    </VisualStateGroup>
                                                    <VisualStateGroup x:Name="SortStates">
                                                        <VisualState x:Name="Unsorted"/>
                                                        <VisualState x:Name="SortAscending">
                                                            <Storyboard>
                                                                <DoubleAnimation Storyboard.TargetName="SortIcon" Storyboard.TargetProperty="Opacity" Duration="0" To="1"/>
                                                            </Storyboard>
                                                        </VisualState>
                                                        <VisualState x:Name="SortDescending">
                                                            <Storyboard>
                                                                <DoubleAnimation Storyboard.TargetName="SortIcon" Storyboard.TargetProperty="Opacity" Duration="0" To="1"/>
                                                            </Storyboard>
                                                            <VisualState.Setters>
                                                                <Setter Target="SortIcon.Glyph" Value="{ThemeResource SortIconDescending}"/>
                                                            </VisualState.Setters>
                                                        </VisualState>
                                                    </VisualStateGroup>
                                                </VisualStateManager.VisualStateGroups>
                    
                                                <Grid.RowDefinitions>
                                                    <RowDefinition Height="auto" MinHeight="32"/>
                                                    <RowDefinition Height="*" MinHeight="32"/>
                                                </Grid.RowDefinitions>
                    
                    
                                                <Rectangle x:Name="BackgroundRectangle" Stretch="Fill" Grid.RowSpan="2" Grid.ColumnSpan="2" Fill="AliceBlue"/>
                                                <Grid Grid.Row="0" HorizontalAlignment="{TemplateBinding HorizontalContentAlignment}" VerticalAlignment="{TemplateBinding VerticalContentAlignment}" Margin="{TemplateBinding Padding}">
                                                    <Grid.ColumnDefinitions>
                                                        <ColumnDefinition Width="*"/>
                                                        <ColumnDefinition MinWidth="32" Width="Auto"/>
                                                    </Grid.ColumnDefinitions>
                    
                                                    <ContentPresenter Grid.Row="0" Grid.Column="0" Content="{TemplateBinding Content}" HorizontalAlignment="Stretch" VerticalAlignment="Center"/>
                    
                                                    <FontIcon Grid.Column="1" x:Name="SortIcon" FontFamily="{ThemeResource SymbolThemeFontFamily}" Glyph="{ThemeResource SortIconAscending}" FontSize="12"
                                                    HorizontalAlignment="Center" VerticalAlignment="Center" Opacity="0"/>
                                                </Grid>
                    
                                                <toolkit:DockPanel Margin="0" HorizontalAlignment="Stretch" Grid.Row="1">
                                                    <ComboBox 
                                                        Style="{ThemeResource DataGridColumnHeader_ComboBox_Style}" 
                                                        x:Name="ComboBox_Operator"
                                                        Loaded="DataGridColumnHeader_ComboxBox_Operator_${field.classMemberName}_Loaded"
                                                        SelectionChanged="DataGridColumnHeader_ComboBox_Operator_${field.classMemberName}_SelectionChanged" 
                                                            >
                                                    </ComboBox>
                                                    <AutoSuggestBox
                                                            x:Name="AutoSuggestBox_${field.classMemberName}"
                                                            Style="{ThemeResource DataGridColumnHeader_AutoSuggestBox_Style}"
                                                            TextBoxStyle="{ThemeResource DataGridColumnHeader_AutoSuggestBox_TexboxStyle}"
                                                            Loaded="DataGridColumnHeader_AutoSuggestBox_${field.classMemberName}_Loaded"
                                                            TextChanged="DataGridColumnHeader_AutoSuggestBox_${field.classMemberName}_TextChanged"
                                                            SuggestionChosen="DataGridColumnHeader_AutoSuggestBox_${field.classMemberName}_SuggestionChosen"
                                                            QuerySubmitted="DataGridColumnHeader_AutoSuggestBox_${field.classMemberName}_QuerySubmitted"
                                                        >
                                                    </AutoSuggestBox>
                                                </toolkit:DockPanel>
                                            </Grid>
                                        </ControlTemplate>                                      
                                    </Setter.Value>
                                </Setter>
                            </Style>
                        </toolkit:DataGridTemplateColumn.HeaderStyle>
                        <toolkit:DataGridTemplateColumn.CellTemplate>
                            <DataTemplate>
                                <TextBlock Text="{Binding ${field.classMemberName}}" Style="{ThemeResource DataGridColumn_CellTemplate_Style}"/>
                            </DataTemplate>
                        </toolkit:DataGridTemplateColumn.CellTemplate>
                        <toolkit:DataGridTemplateColumn.CellEditingTemplate>
                            <DataTemplate>
                                <TextBox Text="{Binding ${field.classMemberName}, Mode=TwoWay}" Style="{ThemeResource DataGridColumn_CellEditingTemplate_Style}" />
                            </DataTemplate>
                        </toolkit:DataGridTemplateColumn.CellEditingTemplate>
                    </toolkit:DataGridTemplateColumn>
                    `;
                    }).join("\n")
                    }
                </toolkit:DataGrid.Columns>
            </toolkit:DataGrid>

            <muxc:ProgressBar
                    Margin="0,50,0,0"
                    HorizontalAlignment="Stretch"
                    VerticalAlignment="Top"
                    IsIndeterminate="True"
                    Visibility="{x:Bind ViewModel.IsLoading, Mode=OneWay}" />
        </Grid>

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
                        <Setter Target="MainCommandBar.DefaultLabelPosition" Value="Bottom"/>
                    </VisualState.Setters>
                </VisualState>
            </VisualStateGroup>
        </VisualStateManager.VisualStateGroups>
    </RelativePanel>
</Page>
`

