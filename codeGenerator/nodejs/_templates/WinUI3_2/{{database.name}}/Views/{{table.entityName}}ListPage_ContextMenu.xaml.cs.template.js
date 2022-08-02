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
    /// Context menu.
    /// </summary>
    public sealed partial class ${table.entityName}ListPage
    {
        ${(table.contextMenu || []).map(m => `
        private void ${m.name}_Click(object sender, RoutedEventArgs e)
        {
            UInt32 index = 0;
            foreach (object row in ${table.entityName.ToVariableName()}DataGrid.SelectedItems)
            {
                ${table.entityName} item = (row as ${table.entityName}ViewModel).Model;
                index++;
            }
        }
        `).join("")}
    }
}
`
