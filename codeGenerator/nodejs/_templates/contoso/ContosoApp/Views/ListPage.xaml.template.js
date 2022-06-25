tables.map(table => {
    fsCustom.writeFileSync(path.join(generatedFileConfig.outDirPath, `${table.modelName}ListPage.xaml.cs`),
`
using CommunityToolkit.WinUI;
using CommunityToolkit.WinUI.UI.Controls;
using Contoso.App.ViewModels;
using Microsoft.UI.Dispatching;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
//using Microsoft.UI.Xaml.Media.Animation;
using Microsoft.UI.Xaml.Navigation;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Windows.UI.Xaml.Interop;

namespace Contoso.App.Views
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ${table.modelName}ListPage : Page
    {
        private DispatcherQueue dispatcherQueue = DispatcherQueue.GetForCurrentThread();

        /// <summary>
        /// Initializes the page.
        /// </summary>
        public ${table.modelName}ListPage()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Gets the app-wide ViewModel instance.
        /// </summary>
        public MainViewModel ViewModel => App.ViewModel;

        /// <summary>
        /// Initializes the AutoSuggestBox portion of the search box.
        /// </summary>
        private void ${table.modelName}SearchBox_Loaded(object sender, RoutedEventArgs e)
        {
            if (${table.modelName.toLowerCase()}SearchBox != null)
            {
                ${table.modelName.toLowerCase()}SearchBox.AutoSuggestBox.QuerySubmitted += ${table.modelName}SearchBox_QuerySubmitted;
                ${table.modelName.toLowerCase()}SearchBox.AutoSuggestBox.TextChanged += ${table.modelName}SearchBox_TextChanged;
                ${table.modelName.toLowerCase()}SearchBox.AutoSuggestBox.PlaceholderText = "Search ${table.modelName}s...";
            }
        }

        /// <summary>
        /// Updates the search box items source when the user changes the search text.
        /// </summary>
        private async void ${table.modelName}SearchBox_TextChanged(AutoSuggestBox sender,
            AutoSuggestBoxTextChangedEventArgs args)
        {
            // We only want to get results when it was a user typing,
            // otherwise we assume the value got filled in by TextMemberPath
            // or the handler for SuggestionChosen.
            if (args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
            {
                // If no search query is entered, refresh the complete list.
                if (String.IsNullOrEmpty(sender.Text))
                {
                    await dispatcherQueue.EnqueueAsync(async () =>
                        await ViewModel.Get${table.modelName}ListAsync());
                    sender.ItemsSource = null;
                }
                else
                {
                    string[] parameters = sender.Text.Split(new char[] { ' ' },
                        StringSplitOptions.RemoveEmptyEntries);
                    sender.ItemsSource = ViewModel.${table.modelName}s
                        .Where(${table.modelName} => 
                            parameters.Any(parameter =>
                                ${table.fields.map( f => {
                                    let t = f.dstLangType === "string" ? "" : ".ToString()";
                                    return `${table.modelName}.${f.Name}${t}.StartsWith(parameter, StringComparison.OrdinalIgnoreCase)`
                                }).join(' ||\n                        ')}
                            )
                        )
                        .OrderByDescending(${table.modelName} => 
                            parameters.Count(parameter =>
                                ${table.fields.map( f => {
                                    let t = f.dstLangType === "string" ? "" : ".ToString()";
                                    return `${table.modelName}.${f.Name}${t}.StartsWith(parameter, StringComparison.OrdinalIgnoreCase)`;
                                }).join(' ||\n                        ')}
                            )
                        )
                        .Select(${table.modelName} => $"${table["fields"].map(f => "{" + table.modelName + "." + f.Name +"}").join(" ")}");
                }
            }
        }

        /// Filters or resets the ${table.modelName} list based on the search text.
        /// </summary>
        private async void ${table.modelName}SearchBox_QuerySubmitted(AutoSuggestBox sender,
            AutoSuggestBoxQuerySubmittedEventArgs args)
        {
            if (String.IsNullOrEmpty(args.QueryText))
            {
                await Reset${table.modelName}List();
            }
            else
            {
                await Filter${table.modelName}List(args.QueryText);
            }
        }

        /// <summary>
        /// Resets the ${table.modelName} list.
        /// </summary>
        private async Task Reset${table.modelName}List()
        {
            await dispatcherQueue.EnqueueAsync(async () =>
                await ViewModel.Get${table.modelName}ListAsync());
        }

        /// <summary>
        /// Filters the ${table.modelName} list based on the search text.
        /// </summary>
        private async Task Filter${table.modelName}List(string text)
        {
            string[] parameters = text.Split(new char[] { ' ' },
                StringSplitOptions.RemoveEmptyEntries);

            var matches = ViewModel.${table.modelName}s
                .Where(${table.modelName} => 
                    parameters.Any(parameter =>
                        ${table.fields.map( f => {
                            let t = f.dstLangType === "string" ? "" : ".ToString()";
                            return `${table.modelName}.${f.Name}${t}.StartsWith(parameter, StringComparison.OrdinalIgnoreCase)`;
                        }).join(' ||\n                        ')}
                    )
                )
                .OrderByDescending(${table.modelName} => 
                    parameters.Count(parameter =>
                        ${table.fields.map( f => {
                            let t = f.dstLangType === "string" ? "" : ".ToString()";
                            return `${table.modelName}.${f.Name}${t}.StartsWith(parameter, StringComparison.OrdinalIgnoreCase)`;
                        }).join(' ||\n                        ')}
                    )
                )
                .ToList();

            await dispatcherQueue.EnqueueAsync(() =>
            {
                ViewModel.${table.modelName}s.Clear();
                foreach (var match in matches)
                {
                    ViewModel.${table.modelName}s.Add(match);
                }
            });
        }

        /// <summary>
        /// Resets the ${table.modelName} list when leaving the page.
        /// </summary>
        protected async override void OnNavigatedFrom(NavigationEventArgs e)
        {
            await Reset${table.modelName}List();
        }

        /// <summary>
        /// Applies any existing filter when navigating to the page.
        /// </summary>
        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            if (!string.IsNullOrWhiteSpace(${table.modelName.toLowerCase()}SearchBox.AutoSuggestBox.Text))
            {
                await Filter${table.modelName}List(${table.modelName.toLowerCase()}SearchBox.AutoSuggestBox.Text);
            }
        }


        /// <summary>
        /// Menu flyout click control for selecting a ${table.modelName} and displaying details.
        /// </summary>
        //private void ViewDetails_Click(object sender, RoutedEventArgs e)
        //{
        //    if (ViewModel.Selected${table.modelName} != null)
        //    {
        //        Frame.Navigate(typeof(${table.modelName}DetailPage), ViewModel.Selected${table.modelName}.Model.Id,
        //            new DrillInNavigationTransitionInfo());
        //    }
        //}

        //private void DataGrid_DoubleTapped(object sender, DoubleTappedRoutedEventArgs e) =>
        //    Frame.Navigate(typeof(${table.modelName}DetailPage), ViewModel.Selected${table.modelName}.Model.Id,
        //            new DrillInNavigationTransitionInfo());

        /// <summary>
        /// Navigates to a blank ${table.modelName} details page for the user to fill in.
        /// </summary>
        //private void Create${table.modelName}_Click(object sender, RoutedEventArgs e) =>
        //    Frame.Navigate(typeof(${table.modelName}DetailPage), null, new DrillInNavigationTransitionInfo());

        /// <summary>
        /// Reverts all changes to the row if the row has changes but a cell is not currently in edit mode.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DataGrid_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (e.Key == Windows.System.VirtualKey.Escape &&
                ViewModel.Selected${table.modelName} != null &&
                ViewModel.Selected${table.modelName}.IsModified &&
                !ViewModel.Selected${table.modelName}.IsInEdit)
            {
                (sender as DataGrid).CancelEdit(DataGridEditingUnit.Row);
            }
        }

        /// <summary>
        /// Selects the tapped ${table.modelName}. 
        /// </summary>
        private void DataGrid_RightTapped(object sender, RightTappedRoutedEventArgs e) =>
            ViewModel.Selected${table.modelName} = (e.OriginalSource as FrameworkElement).DataContext as ${table.modelName}ViewModel;

        /// <summary>
        /// Opens the order detail page for the user to create an order for the selected ${table.modelName}.
        /// </summary>
        //private void AddOrder_Click(object sender, RoutedEventArgs e) =>
        //    Frame.Navigate(typeof(OrderDetailPage), ViewModel.Selected${table.modelName}.Model.Id);

        /// <summary>
        /// Opens the order detail page for the user to create an order for the selected ${table.modelName}.
        /// </summary>
        private void OpenOrder_Click(object sender, RoutedEventArgs e)
        {
            //Process subprocess = new Process();
            //subprocess.StartInfo.FileName = "Notepad.exe";
            //subprocess.StartInfo.WindowStyle = ProcessWindowStyle.Maximized;
            //subprocess.StartInfo.Arguments = ViewModel.Selected${table.modelName}.Model.Email + ".txt";
            //subprocess.Start();
            //Process subprocess = new Process();
            //subprocess.StartInfo.FileName = "Notepad.exe";
            //subprocess.StartInfo.WindowStyle = ProcessWindowStyle.Maximized;
            //subprocess.StartInfo.Arguments = sender.ToString() + ".txt";
            //subprocess.Start();
            //System.Windows.Forms.MessageBox.Show(sender.ToString() + " " + sender.GetType().ToString() + (sender as MenuFlyoutItem).ToString());
            //System.Windows.Forms.MessageBox.Show(${table.modelName.toLowerCase()}DataGrid.ToString());

            int index = 0;
            foreach (object row in ${table.modelName.toLowerCase()}DataGrid.SelectedItems)
            {
                ${table.modelName}ViewModel ${table.modelName} = (row as ${table.modelName}ViewModel);
                Process subprocess = new Process();
                subprocess.StartInfo.FileName = "Notepad.exe";
                subprocess.StartInfo.WindowStyle = ProcessWindowStyle.Maximized;
                subprocess.StartInfo.Arguments = ${table.modelName}.Model.${table.fields[0].Name}.ToString() + ".txt";
                subprocess.Start();
                index++;
            }
        }


        /// <summary>
        /// Sorts the data in the DataGrid.
        /// </summary>
        private void DataGrid_Sorting(object sender, DataGridColumnEventArgs e) =>
            (sender as DataGrid).Sort(e.Column, ViewModel.${table.modelName}s.Sort);
    }
}
`);

fsCustom.writeFileSync(path.join(generatedFileConfig.outDirPath, `${table.modelName}ListPage.xaml`),
`
<Page
    x:Class="Contoso.App.Views.${table.modelName}ListPage"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:vm="using:Contoso.App.ViewModels"
    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
    xmlns:uc="using:Contoso.App.UserControls"
    xmlns:muxc="using:Microsoft.UI.Xaml.Controls"
    xmlns:toolkit="using:CommunityToolkit.WinUI.UI.Controls"
    NavigationCacheMode="Required"
    mc:Ignorable="d">

    <Page.Resources>
        <MenuFlyout x:Key="DataGridContextMenu">
            <!--<MenuFlyoutItem
                Click="ViewDetails_Click"
                Text="View details"
                Icon="OpenFile">
            </MenuFlyoutItem>-->
            <!--<MenuFlyoutItem
	            Click="OpenOrder_Click"
	            Text="Open order"
	            Icon="OpenFile">
			</MenuFlyoutItem>-->
        </MenuFlyout>
    </Page.Resources>

    <RelativePanel x:Name="LayoutRoot">
        <TextBlock
                x:Name="PageTitle"
                Style="{StaticResource PageTitleTextBlockStyle}"
                Text="${table.modelName}s"/>

        <CommandBar
                x:Name="MainCommandBar"
                HorizontalAlignment="Stretch"
                Background="Transparent"
                DefaultLabelPosition="Right"
                RelativePanel.LeftOf="${table.modelName.toLowerCase()}SearchBox"
                RelativePanel.RightOf="PageTitle">
            <!--<AppBarButton
                    Click="ViewDetails_Click"
                    Icon="Contact"
                    IsEnabled="{x:Bind vm:Converters.IsNotNull(ViewModel.Selected${table.modelName}), Mode=OneWay}"
                    Label="View details"
                    ToolTipService.ToolTip="View details" />
            <AppBarSeparator/>-->
            <!--<AppBarButton
                    Click="Create${table.modelName}_Click"
                    Icon="Add"
                    Label="New"
                    ToolTipService.ToolTip="New ${table.modelName}" />-->
            <!--<AppBarButton
                    Click="{x:Bind ViewModel.Sync}"
                    Icon="Refresh"
                    Label="Sync"
                    ToolTipService.ToolTip="Sync with server" />-->
        </CommandBar>

        <uc:CollapsibleSearchBox
                x:Name="${table.modelName.toLowerCase()}SearchBox"
                Width="240"
                Margin="12,8,12,0"
                CollapseWidth="{StaticResource LargeWindowSnapPoint}"
                Loaded="${table.modelName}SearchBox_Loaded"
                RelativePanel.AlignRightWithPanel="True"/>

        <Grid
                Margin="0,10,0,0"
                RelativePanel.AlignLeftWithPanel="True"
                RelativePanel.AlignRightWithPanel="True"
                RelativePanel.Below="PageTitle">

            <toolkit:DataGrid
                    CanUserReorderColumns="True"
                    CanUserResizeColumns="True"
                    AutoGenerateColumns="False"
                    Sorting="DataGrid_Sorting"
                    BorderThickness="0"
                    GridLinesVisibility="None"
                    x:Name="${table.modelName.toLowerCase()}DataGrid"
                    ItemsSource="{x:Bind ViewModel.${table.modelName}s}"
                    SelectedItem="{x:Bind ViewModel.Selected${table.modelName}, Mode=TwoWay}"
                    SelectionMode="Extended"
                    IsReadOnly="False"
                    KeyDown="DataGrid_KeyDown"
                    ContextFlyout="{StaticResource DataGridContextMenu}">


                <toolkit:DataGrid.Columns>
                    ${
                        table.fields.filter(f => f.dstLangType !== "byte[]").map(f => 
                            `<toolkit:DataGridTextColumn
                            Header="${f.Name}"
                            Tag="${f.Name}"
                            Binding="{Binding ${f.Name}}"
                            IsReadOnly="False"
                            CanUserSort="True"/>`
                        ).join("\n")
                    }
                </toolkit:DataGrid.Columns>
            </toolkit:DataGrid>

            <muxc:ProgressBar
                    Margin="0,50,0,0"
                    HorizontalAlignment="Stretch"
                    VerticalAlignment="Top"
                    IsIndeterminate="True"
                    Visibility="{x:Bind ViewModel.Is${table.modelName}Loading, Mode=OneWay}" />
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
);

}
);


