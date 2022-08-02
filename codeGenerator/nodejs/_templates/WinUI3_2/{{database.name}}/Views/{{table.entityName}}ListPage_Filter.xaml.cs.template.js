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
using System.Windows.Forms;
using System.IO;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;

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

        private async Task ApplyFilter ()
        {
            ${table.fields.filter(field => field.IsVisible === true).map(field => {return `
            ${field.destLangType.replace("?", "")} _${field.classMemberName}${field.destLangType === "string" ? ` = _autoSuggestBox_${field.classMemberName}.Text;` : ""};
            bool _${field.classMemberName}IsInValid = ${field.destLangType === "string" ? "false;"  : "!" + field.destLangType.replace("?", "") + ".TryParse(_autoSuggestBox_" + field.classMemberName + ".Text, out " + "_" + field.classMemberName + ");"}`
            }
            ).join("")}
            List<${table.entityName}ViewModel> matches = ViewModel.DataSource
                .Where(item =>  
                    ${table.fields.filter(field => field.IsVisible === true).map(field => `(String.IsNullOrEmpty(_autoSuggestBox_${field.classMemberName}.Text)  || _${field.classMemberName}IsInValid || IsMatched_${field.classMemberName}(item.${field.classMemberName}, _${field.classMemberName}))`).join("\n                   && ")}
                )
                .ToList();
            await dispatcherQueue.EnqueueAsync(() =>
            {
                ViewModel.FilteredList.Clear();
                foreach (${table.entityName}ViewModel match in matches)
                {
                    ViewModel.FilteredList.Add(match);
                }
            });
        }

        ${table.fields.filter(field => field.IsVisible === true).map(field => `
        private FilterOperations.IsMatched<${field.destLangType}> IsMatched_${field.classMemberName} = (${field.destLangType} a, ${field.destLangType} b) => a == b;`).join("")}

    }
}
`
