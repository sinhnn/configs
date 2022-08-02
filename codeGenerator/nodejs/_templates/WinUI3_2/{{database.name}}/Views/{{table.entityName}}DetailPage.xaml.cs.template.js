`
using System;
using System.Linq;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Media.Animation;
using Microsoft.UI.Xaml.Navigation;
using CommunityToolkit.WinUI.UI.Controls;

using ${projectName}.Common.Views;
using ${context.namespace.ParentNamespace(1)}.Models;
using ${context.namespace.ParentNamespace(1)}.ViewModels;

namespace ${context.namespace}
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ${table.entityName}DetailPage : Page
    {
        /// <summary>
        /// Initializes the page.
        /// </summary>
        public ${table.entityName}DetailPage()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Used to bind the UI to the data.
        /// </summary>
        public ${table.entityName}ViewModel ViewModel { get; set; }

        /// <summary>
        /// Navigate to the previous page when the user cancels the creation of a new ${table.entityName} record.
        /// </summary>
        private void AddNewCanceled(object sender, EventArgs e) => Frame.GoBack();

        /// <summary>
        /// Displays the selected ${table.entityName} data.
        /// </summary>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            if (e.Parameter == null)
            {
                ViewModel = new ${table.entityName}ViewModel
                {
                    IsNew = true,
                    IsInEdit = true
                };
                VisualStateManager.GoToState(this, "New${table.entityName}", false);
            }
            else
            {
                ViewModel = App.${table.entityName.ToVariableName()}MainViewModel.DataSource.Where(
                    item => item.Model.Id == (${table.fields.find(f => f.classMemberName == "Id") ? table.fields.find(f => f.classMemberName == "Id").destLangType : "Guid" })e.Parameter).First();
            }

            ViewModel.AddNewCanceled += AddNewCanceled;
            base.OnNavigatedTo(e);
        }

        /// <summary>
        /// Check whether there are unsaved changes and warn the user.
        /// </summary>
        protected async override void OnNavigatingFrom(NavigatingCancelEventArgs e)
        {
            if (ViewModel.IsModified)
            {
                // Cancel the navigation immediately, otherwise it will continue at the await call. 
                e.Cancel = true;

                void resumeNavigation()
                {
                    if (e.NavigationMode == NavigationMode.Back)
                    {
                        Frame.GoBack();
                    }
                    else
                    {
                        Frame.Navigate(e.SourcePageType, e.Parameter, e.NavigationTransitionInfo);
                    }
                }

                var saveDialog = new SaveChangesDialog() { Title = $"Save changes?" };
                saveDialog.XamlRoot = this.Content.XamlRoot;
                await saveDialog.ShowAsync();
                SaveChangesDialogResult result = saveDialog.Result;

                switch (result)
                {
                    case SaveChangesDialogResult.Save:
                        await ViewModel.SaveAsync();
                        resumeNavigation();
                        break;
                    case SaveChangesDialogResult.DontSave:
                        await ViewModel.RevertChangesAsync();
                        resumeNavigation();
                        break;
                    case SaveChangesDialogResult.Cancel:
                        break;
                }
            }

            base.OnNavigatingFrom(e);
        }

        /// <summary>
        /// Disconnects the AddNewCustomerCanceled event handler from the ViewModel 
        /// when the parent frame navigates to a different page.
        /// </summary>
        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            ViewModel.AddNewCanceled -= AddNewCanceled;
            base.OnNavigatedFrom(e);
        }

        /// <summary>
        /// Initializes the AutoSuggestBox portion of the search box.
        /// </summary>
        // private void CustomerSearchBox_Loaded(object sender, RoutedEventArgs e)
        // {
        //     if (sender is UserControls.CollapsibleSearchBox searchBox)
        //     {
        //         searchBox.AutoSuggestBox.QuerySubmitted += CustomerSearchBox_QuerySubmitted;
        //         searchBox.AutoSuggestBox.TextChanged += CustomerSearchBox_TextChanged;
        //         searchBox.AutoSuggestBox.PlaceholderText = "Search customers...";
        //     }
        // }

        /// <summary>
        /// Queries the database for a customer result matching the search text entered.
        /// </summary>
        // private async void CustomerSearchBox_TextChanged(AutoSuggestBox sender,
        //     AutoSuggestBoxTextChangedEventArgs args)
        // {
        //     // We only want to get results when it was a user typing,
        //     // otherwise we assume the value got filled in by TextMemberPath
        //     // or the handler for SuggestionChosen
        //     if (args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
        //     {
        //         // If no search query is entered, refresh the complete list.
        //         if (string.IsNullOrEmpty(sender.Text))
        //         {
        //             sender.ItemsSource = null;
        //         }
        //         else
        //         {
        //             sender.ItemsSource = await App.Repository.Customers.GetAsync(sender.Text);
        //         }
        //     }
        // }

        /// <summary>
        /// Search by customer name, email, or phone number, then display results.
        /// </summary>
        // private void CustomerSearchBox_QuerySubmitted(AutoSuggestBox sender,
        //     AutoSuggestBoxQuerySubmittedEventArgs args)
        // {
        //     if (args.ChosenSuggestion is Customer customer)
        //     {
        //         Frame.Navigate(typeof(${table.entityName}DetailPage), customer.Id);
        //     }
        // }

        /// <summary>
        /// Navigates to the order page for the customer.
        /// </summary>
        // private void ViewOrderButton_Click(object sender, RoutedEventArgs e) =>
        //     Frame.Navigate(typeof(OrderDetailPage), ((sender as FrameworkElement).DataContext as Order).Id,
        //         new DrillInNavigationTransitionInfo());

        /// <summary>
        /// Adds a new order for the customer.
        /// </summary>
        // private void AddOrder_Click(object sender, RoutedEventArgs e) =>
        //     Frame.Navigate(typeof(OrderDetailPage), ViewModel.Model.Id);

        /// <summary>
        /// Sorts the data in the DataGrid.
        /// </summary>
        // private void DataGrid_Sorting(object sender, DataGridColumnEventArgs e) =>
        //     (sender as DataGrid).Sort(e.Column, ViewModel.Orders.Sort);
    }
}
`