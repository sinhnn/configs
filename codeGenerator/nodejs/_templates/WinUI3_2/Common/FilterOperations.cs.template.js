`
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ${context.namespace}
{

    public class Operation
    {
        public Operation(UInt32 id, string name, string shortName)
        {
            Id = id;
            Name = name;
            ShortName = shortName;

        }
        public UInt32 Id { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
    }

    public enum Operator
    {
        Equal,
        NotEqual,
        LessOrEqual,
        LessThan,
        GreaterOrEqual,
        Greater,
        StartsWith,
        Contains,
        NotContains
    }

    public static class FilterOperations
    {

        private static List<Operation> stringFilter = new List<Operation>()
        {
            new Operation ((uint)Operator.Equal, "Equals", "="),
            new Operation ((uint)Operator.NotEqual, "Not Equals", "="),
            new Operation ((uint)Operator.StartsWith , "StartsWith", "S"),
            new Operation ((uint)Operator.Contains, "Contains", "C"),
            new Operation ((uint)Operator.NotContains, "Not Contains", "NC")
        };

        private static List<Operation> numberFilter = new List<Operation>()
        {
            new Operation((uint)Operator.Equal, "Equals", "="),
            new Operation((uint)Operator.NotEqual, "Not Equals", "!="),
            new Operation((uint)Operator.LessOrEqual, "Less Or Equal", "<="),
            new Operation((uint)Operator.LessOrEqual, "Less Than", "<"),
            new Operation((uint)Operator.GreaterOrEqual, "Greater Or Equal", ">="),
            new Operation((uint)Operator.GreaterOrEqual, "Greater Than", ">")
        };

        public static List<Operation> StringFilter { get => stringFilter; private set => stringFilter = value; }
        public static List<Operation> NumberFilter { get => numberFilter; private set => numberFilter = value; }

        /// <summary>
        /// Check two objects are match functor
        /// </summary>
        public delegate bool IsMatched<T>(T a, T b);

        ${["short", "short?", "ushort", "ushort?", "int", "int?", "uint", "uint?", "long", "long?", "ulong", "ulong?", "double", "double?"].map(T => `
        public static readonly IsMatched<${T}> ${T.replace("?", "Nullable").ToCapitalizeCase()}_Equal = (${T} a, ${T} b) => a == b;
        public static readonly IsMatched<${T}> ${T.replace("?", "Nullable").ToCapitalizeCase()}_GreaterOrEqual = (${T} a, ${T} b) => a >= b;
        public static readonly IsMatched<${T}> ${T.replace("?", "Nullable").ToCapitalizeCase()}_LessOrEqual = (${T} a, ${T} b) => a <= b;
        public static readonly IsMatched<${T}> ${T.replace("?", "Nullable").ToCapitalizeCase()}_Greater = (${T} a, ${T} b) => a > b;
        public static readonly IsMatched<${T}> ${T.replace("?", "Nullable").ToCapitalizeCase()}_Less = (${T} a, ${T} b) => a < b;
        public static readonly IsMatched<${T}> ${T.replace("?", "Nullable").ToCapitalizeCase()}_NotEqual = (${T} a, ${T} b) => a != b;
        public static bool UpdateFilterFunction (uint operatorId, ref IsMatched<${T}> functor)
        {
            bool ret = true;
            switch (operatorId)
            {
                case (uint)Operator.Equal:
                    functor = new IsMatched<${T}>((${T} a, ${T} b) => a == b);
                    break;
                case (uint)Operator.NotEqual:
                    functor = new IsMatched<${T}>((${T} a, ${T} b) => a != b);
                    break;
                case (uint)Operator.LessOrEqual:
                    functor = new IsMatched<${T}>((${T} a, ${T} b) => a <= b);
                    break;
                case (uint)Operator.GreaterOrEqual:
                    functor = new IsMatched<${T}>((${T} a, ${T} b) => a >= b);
                    break;
                case (uint)Operator.LessThan:
                    functor = new IsMatched<${T}>((${T} a, ${T} b) => a < b);
                    break;
                case (uint)Operator.Greater:
                    functor = new IsMatched<${T}>((${T} a, ${T} b) => a > b);
                    break;
                default:
                    ret = false;
                    throw new System.InvalidOperationException("Invalid operation on long");
                    break;
            }
            return ret;
        }
        `).join("")
        }

        public static readonly IsMatched<string> String_Equal = (string a, string b) => a == b;
        public static readonly IsMatched<string> String_NotEqual = (string a, string b) => a != b;
        public static readonly IsMatched<string> String_Contains = (string a, string b) => a.Contains(b);
        public static readonly IsMatched<string> String_NotContains = (string a, string b) => !a.Contains(b);
        public static readonly IsMatched<string> String_StartsWith = (string a, string b) => a.StartsWith(b);
        public static readonly IsMatched<string> String_NotStartsWith = (string a, string b) => !a.StartsWith(b);
        public static bool UpdateFilterFunction(uint operatorId, ref IsMatched<string> functor)
        {
            bool ret = true;
            switch (operatorId)
            {
                case (uint)Operator.Equal:
                    functor = new IsMatched<string>((string a, string b) => a == b);
                    break;
                case (uint)Operator.NotEqual:
                    functor = new IsMatched<string>((string a, string b) => a != b);
                    break;
                case (uint)Operator.Contains:
                    functor = new IsMatched<string>((string a, string b) => a.Contains(b));
                    break;
                case (uint)Operator.NotContains:
                    functor = new IsMatched<string>((string a, string b) => !a.Contains(b));
                    break;
                case (uint)Operator.StartsWith:
                    functor = new IsMatched<string>((string a, string b) => a.StartsWith(b));
                    break;
                default:
                    ret = false;
                    throw new System.InvalidOperationException("Invalid operation on long");
                    break;
            }
            return ret;
        }

    }
}
`