fsCustom.writeFileSync(generatedFileConfig.outFilePath,
`
using System;
//using Contoso.App.ViewModels;
//using Contoso.App.Views;
using Contoso.Repository;
//using Contoso.Repository.Rest;
using Contoso.Repository.Sql;
using Microsoft.EntityFrameworkCore;
//using Microsoft.UI.Xaml;
//using Microsoft.UI.Xaml.Media.Animation;
using System.IO;
//using Windows.ApplicationModel;
//using Windows.Globalization;
//using Windows.Storage;


namespace Contoso.Ap
{
    class Program
    {

        static int Main(string[] args)
        {
            string databasePath = @"C:\\Users\\sinhnn\\source\\repos\\ConsoleApp1\\ConsoleApp1\\Cookies";
            var dbOptions = new DbContextOptionsBuilder<ContosoContext>().UseSqlite("Data Source=" + databasePath);
            var Repository = new SqlContosoRepository(dbOptions);
            var cookies = Repository.Cookies.Get();
            //foreach (var cookie in cookies)
            //{
            //    Console.WriteLine(cookie.name, "=", cookie.value);
            //}
            return 0;
        }
    }
}`);
