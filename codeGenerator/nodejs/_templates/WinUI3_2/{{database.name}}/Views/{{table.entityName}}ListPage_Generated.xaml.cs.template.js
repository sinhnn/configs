`
using CommunityToolkit.WinUI;
using CommunityToolkit.WinUI.UI.Controls;
using Microsoft.UI.Dispatching;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Input;
using Microsoft.UI.Xaml.Media.Animation;
using Microsoft.UI.Xaml.Navigation;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Windows.UI.Xaml.Interop;
using System.Windows.Forms;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;

using ${projectName}.Common.Views;
using ${projectName}.${database.name}.Models;
using ${projectName}.${database.name}.ViewModels;


namespace ${context.namespace}
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ${table.entityName}ListPage : Page
    {
        private DispatcherQueue dispatcherQueue = DispatcherQueue.GetForCurrentThread();

        /// <summary>
        /// Initializes the page.
        /// </summary>
        public ${table.entityName}ListPage()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Gets the app-wide ViewModel instance.
        /// </summary>
        public ${table.entityName}MainViewModel ViewModel => App.${table.entityName.ToVariableName()}MainViewModel;


        /// <summary>
        /// Resets the ${table.entityName} list when leaving the page.
        /// </summary>
        protected async override void OnNavigatedFrom(NavigationEventArgs e)
        {
            // await Reset${table.entityName}List();
        }

        /// <summary>
        /// Applies any existing filter when navigating to the page.
        /// </summary>
        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            // if (!string.IsNullOrWhiteSpace(${table.entityName.ToVariableName()}SearchBox.AutoSuggestBox.Text))
            // {
            //     await Filter${table.entityName}List(${table.entityName.ToVariableName()}SearchBox.AutoSuggestBox.Text);
            // }
        }


        /// <summary>
        /// Menu flyout click control for selecting a ${table.entityName} and displaying details.
        /// </summary>
        private void ViewDetails_Click(object sender, RoutedEventArgs e)
        {
           if (ViewModel.SelectedItem != null)
           {
               Frame.Navigate(typeof(${table.entityName}DetailPage), ViewModel.SelectedItem.Model.Id, new DrillInNavigationTransitionInfo());
           }
        }

        private void DataGrid_DoubleTapped(object sender, DoubleTappedRoutedEventArgs e) {
            // Frame.Navigate(typeof(${table.entityName}DetailPage), ViewModel.Selected${table.entityName}.Model.Id,
            //     new DrillInNavigationTransitionInfo());
        }

        /// <summary>
        /// Navigates to a blank ${table.entityName} details page for the user to fill in.
        /// </summary>
        private void Create${table.entityName}_Click(object sender, RoutedEventArgs e) {
            Frame.Navigate(typeof(${table.entityName}NewPage), null, new DrillInNavigationTransitionInfo());
        }


        /// <summary>
        /// Reverts all changes to the row if the row has changes but a cell is not currently in edit mode.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Page_KeyDown(object sender, KeyRoutedEventArgs e)
        {

        }

        /// <summary>
        /// Reverts all changes to the row if the row has changes but a cell is not currently in edit mode.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DataGrid_KeyDown(object sender, KeyRoutedEventArgs e)
        {
            if (e.Key == Windows.System.VirtualKey.Escape &&
                ViewModel.SelectedItem != null &&
                ViewModel.SelectedItem.IsModified &&
                !ViewModel.SelectedItem.IsInEdit)
            {
                (sender as DataGrid).CancelEdit(DataGridEditingUnit.Row);
            }
            else if (e.Key == Windows.System.VirtualKey.F5) {

            }
        }

        /// <summary>
        /// Selects the tapped ${table.entityName}. 
        /// </summary>
        private void DataGrid_RightTapped(object sender, RightTappedRoutedEventArgs e) {
            ViewModel.SelectedItem = (e.OriginalSource as FrameworkElement).DataContext as ${table.entityName}ViewModel;
        }

        /// <summary>
        /// Opens the order detail page for the user to create an order for the selected ${table.entityName}.
        /// </summary>
        private void Add${table.entityName}_Click(object sender, RoutedEventArgs e) {
            Frame.Navigate(typeof(${table.entityName}DetailPage), ViewModel.SelectedItem.Model.Id);
        }

        /// <summary>
        /// Opens the order detail page for the user to create an order for the selected ${table.entityName}.
        /// </summary>
        private void Open${table.entityName}_Click(object sender, RoutedEventArgs e)
        {
            int index = 0;
            foreach (object row in ${table.entityName.ToVariableName()}DataGrid.SelectedItems)
            {
                ${table.entityName}ViewModel ${table.entityName} = (row as ${table.entityName}ViewModel);
                Process subprocess = new Process();
                subprocess.StartInfo.FileName = "Notepad.exe";
                subprocess.StartInfo.WindowStyle = ProcessWindowStyle.Maximized;
                subprocess.StartInfo.Arguments = ${table.entityName}.Model.${table.fields[0].classMemberName}.ToString() + ".txt";
                subprocess.Start();
                index++;
            }
        }

        /// <summary>
        /// Opens the order detail page for the user to create an order for the selected ${table.entityName}.
        /// </summary>
        private void Remove${table.entityName}_Click(object sender, RoutedEventArgs e)
        {
            int index = 0;
            foreach (object row in ${table.entityName.ToVariableName()}DataGrid.SelectedItems)
            {
                ${table.entityName} ${table.entityName.ToVariableName()} = (row as ${table.entityName}ViewModel).Model;
                ViewModel.Repository.Remove(${table.entityName.ToVariableName()});
            }
        }


        /// <summary>
        /// Sorts the data in the DataGrid.
        /// </summary>
        private void DataGrid_Sorting(object sender, DataGridColumnEventArgs e) {
            (sender as DataGrid).Sort(e.Column, ViewModel.FilteredList.Sort);
        }

        private void AddBulk${table.entityName}(List<${table.entityName}> records)
        {
            int numberNew = 0;
            foreach (${table.entityName} record in records)
            {
                var existing = ViewModel.DataSource
                        .Where(recordInCollection => recordInCollection.Model.Equals(record))
                        .FirstOrDefault();
                if (existing != null)
                {
                    MessageBox.Show($"{record.ToString()} already exists", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    continue;
                }
                else
                {
                    ${table.entityName}ViewModel ${table.entityName.ToVariableName()}ViewModel = new ${table.entityName}ViewModel(record);
                    // ${table.entityName.ToVariableName()}ViewModel.IsNewChromeEntity = true;
                    ${table.entityName.ToVariableName()}ViewModel.IsModified = true;
                    ViewModel.DataSource.Add(${table.entityName.ToVariableName()}ViewModel);
                    numberNew += 1;
                }
            }

            if (numberNew > 0)
            {
                MessageBox.Show($"Adding {numberNew} ${table.entityName}.", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);
                ViewModel.Sync();
            }
            return;
        }
        
        private void Export${table.entityName}_Click(object sender, RoutedEventArgs e)
        {
            SaveFileDialog saveFileDialog1 = new SaveFileDialog();
            saveFileDialog1.Filter = "CSV files (*.csv)|*.csv|Text files (*.txt)|*.txt|All files (*.*)|*.*";
            saveFileDialog1.DefaultExt = "csv";
            saveFileDialog1.FileName = "${table.entityName}";
            saveFileDialog1.RestoreDirectory = true;
            if (saveFileDialog1.ShowDialog() == DialogResult.OK)
            {
                using (var writer = new System.IO.StreamWriter(saveFileDialog1.FileName))
                using (var csv = new CsvHelper.CsvWriter(writer, System.Globalization.CultureInfo.InvariantCulture))
                {
                    csv.Context.RegisterClassMap<${table.entityName}ViewModelMap>();
                    csv.WriteRecords(${table.entityName.ToVariableName()}DataGrid.SelectedItems);
                    if (${table.entityName.ToVariableName()}DataGrid.SelectedItems.Count > 0)
                    {
                        csv.WriteRecords(${table.entityName.ToVariableName()}DataGrid.SelectedItems);
                    }
                    else
                    {
                        csv.WriteRecords(ViewModel.DataSource);
                    }
                }
            }
        }


        private void Import${table.entityName}_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog openFileDialog1 = new OpenFileDialog();
            if (openFileDialog1.ShowDialog() == DialogResult.OK)
            {
                using (var reader = new StreamReader(openFileDialog1.FileName))
                using (var csv = new CsvReader(reader, System.Globalization.CultureInfo.InvariantCulture))
                {
                    // csv.Context.RegisterClassMap<${table.entityName}ViewModelMap>();
                    var records = csv.GetRecords<${table.entityName}>();
                    AddBulk${table.entityName}(records.ToList());
                }
            }
        }
    }
}
`
