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

using ${projectName}.${database.name}.Models;
using ${projectName}.${database.name}.ViewModels;


namespace ${context.namespace}
{

    /// <summary>
    /// Import/Export to CSV
    /// </summary>
    public sealed class ${table.entityName}ViewModelMap : ClassMap<${table.entityName}ViewModel>
    {
        public  ${table.entityName}ViewModelMap()
        {
            // AutoMap(CultureInfo.InvariantCulture);
            ${table.fields.filter(f => !f.destLangType.includes("byte")).map(f => `
            Map(${table.entityName.ToVariableName()} => ${table.entityName.ToVariableName()}.Model.${f.classMemberName});`
            ).join("")}
        }
    }

    /// <summary>
    /// Import/Export to CSV
    /// </summary>
    public sealed class ${table.entityName}Map : ClassMap<${table.entityName}>
    {
        public  ${table.entityName}Map()
        {
            // AutoMap(CultureInfo.InvariantCulture);
            ${table.fields.filter(f => !f.destLangType.includes("byte")).map(f => `
            Map(${table.entityName.ToVariableName()} => ${table.entityName.ToVariableName()}.${f.classMemberName});`
            ).join("")}
        }
    }
}
`

