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

using ${projectName}.Common.Views;
using ${projectName}.${database.name}.Models;
using ${projectName}.${database.name}.ViewModels;

namespace ${context.namespace}
{

    
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ${table.entityName}NewPage : Page
    {
        ${table.fields.filter(field => field.IsVisible === true).map(field => { return `
            private AutoSuggestBox? _autoSuggestBox_${field.classMemberName} = null;
            private void AutoSuggestBox_${field.classMemberName}_Loaded(object sender, RoutedEventArgs args)
            {
              _autoSuggestBox_${field.classMemberName} = (sender as AutoSuggestBox);
            }

            private void AutoSuggestBox_${field.classMemberName}_SuggestionChosen(AutoSuggestBox sender, AutoSuggestBoxSuggestionChosenEventArgs args)
            {
                // Set sender.Text. You can use args.SelectedItem to build your text string.
            }

            private async void AutoSuggestBox_${field.classMemberName}_QuerySubmitted(AutoSuggestBox sender, AutoSuggestBoxQuerySubmittedEventArgs args)
            {
              if (args.ChosenSuggestion != null)
              {
                // User selected an item from the suggestion list, take an action on it here.
                sender.Text = args.ChosenSuggestion.ToString();
                ViewModel.IsInEdit = true;
              }
              // else
              // {
              //   await ApplyFilter ();
              // }
            }

            private async void AutoSuggestBox_${field.classMemberName}_TextChanged(AutoSuggestBox sender, AutoSuggestBoxTextChangedEventArgs args)
            {
                ViewModel.IsInEdit = true;
                if (args.Reason == AutoSuggestionBoxTextChangeReason.UserInput)
                {
                    // If no search query is entered, refresh the complete list.
                    if (String.IsNullOrEmpty((sender as AutoSuggestBox).Text))
                    {
                        // await dispatcherQueue.EnqueueAsync(async () => await ViewModel.GetListAsync());
                        // await ApplyFilter();
                        sender.ItemsSource = null;
                    }
                    else
                    {
                        sender.ItemsSource = App.${table.entityName.ToVariableName()}MainViewModel.DataSource
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

