`
using CommunityToolkit.WinUI;
using CommunityToolkit.WinUI.UI.Controls;
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
// using System.Windows.Forms;
using System.IO;

using ${projectName}.Common;
using ${projectName}.${database.name}.Models;
using ${projectName}.${database.name}.ViewModels;

namespace ${context.namespace}
{

    
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ${table.entityName}ListPage : Page
    {
        ${table.fields.filter(field => field.IsVisible === true).map(field => { return `
            private Microsoft.UI.Xaml.Controls.ComboBox? _comboBox_Operator_${field.classMemberName} = null;
            private void DataGridColumnHeader_ComboxBox_Operator_${field.classMemberName}_Loaded(object sender, RoutedEventArgs args)
            {
                _comboBox_Operator_${field.classMemberName} = (sender as Microsoft.UI.Xaml.Controls.ComboBox);
                _comboBox_Operator_${field.classMemberName}.ItemsSource = ${field.destLangType === "string" ? "FilterOperations.StringFilter" : "FilterOperations.NumberFilter"};
                _comboBox_Operator_${field.classMemberName}.DisplayMemberPath = "Name";
                _comboBox_Operator_${field.classMemberName}.SelectedIndex = 0; // Equals               
            }


            private void DataGridColumnHeader_ComboBox_Operator_${field.classMemberName}_SelectionChanged(object  sender, SelectionChangedEventArgs args)
            {
                // update filter function
                // IsMatched_${field.classMemberName} = new IsMatched_${field.classMemberName}(String.Equals);
                Operation selected = ((sender as Microsoft.UI.Xaml.Controls.ComboBox).SelectedItem as Operation);
                bool IsUpdatedFunctor = FilterOperations.UpdateFilterFunction(selected.Id, ref IsMatched_${field.classMemberName});
            }

            private AutoSuggestBox? _autoSuggestBox_${field.classMemberName} = null;
            private void DataGridColumnHeader_AutoSuggestBox_${field.classMemberName}_Loaded(object sender, RoutedEventArgs args)
            {
              _autoSuggestBox_${field.classMemberName} = (sender as AutoSuggestBox);
            }

            private void DataGridColumnHeader_AutoSuggestBox_${field.classMemberName}_SuggestionChosen(AutoSuggestBox sender, AutoSuggestBoxSuggestionChosenEventArgs args)
            {
                // Set sender.Text. You can use args.SelectedItem to build your text string.
            }

            private async void DataGridColumnHeader_AutoSuggestBox_${field.classMemberName}_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
            {
              if (args.ChosenSuggestion != null)
              {
                // User selected an item from the suggestion list, take an action on it here.
                sender.Text = args.ChosenSuggestion.ToString();
              }
              // else
              {
                await ApplyFilter ();
              }
            }

            private async void DataGridColumnHeader_AutoSuggestBox_${field.classMemberName}_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
            {
                if (args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
                {
                    // If no search query is entered, refresh the complete list.
                    if (String.IsNullOrEmpty((sender as AutoSuggestBox).Text))
                    {
                        // await dispatcherQueue.EnqueueAsync(async () => await ViewModel.GetListAsync());
                        await ApplyFilter();
                        sender.ItemsSource = null;
                    }
                    else
                    {
                        sender.ItemsSource = ViewModel.FilteredList
                            .Where(item => item.${field.classMemberName}.ToString().Contains(sender.Text, StringComparison.OrdinalIgnoreCase))
                            .OrderByDescending(item => item.${field.classMemberName})
                            .Select(item => item.${field.classMemberName}).Distinct();
                    }
                }
            }
            `
        }
        ).join("")}

    }
}
`