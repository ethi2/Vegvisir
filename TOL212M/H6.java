// H�fundur/Author: Snorri Agnarsson, snorri@hi.is

public class H6
{
    // Notkun: BSTNode s = H6.insertBST(t,x);
    // Fyrir:  t er tv�leitartr�, x er heiltala.
    // Eftir:  s er tv�leitartr� sem inniheldur hn�ta sem
    //         hafa s�mu gildi og hn�tarnir � t og auk �ess
    //         hn�t sem inniheldur gildi� x.
    //         s inniheldur �v� einum hn�t fleiri en t og
    //         einum fleiri hn�ta sem innihalda gildi� x.

    // Usage:  BSTNode s = H6.insertBST(t,x);
    // Pre:    t is a binary search tree, x is an int.
    // Post:   s is a binary search tree that contains nodes
    //         which have the same values as t and in
    //         addition contains a node which contains the
    //         value x. s therefore contains one more node
    //         than t does and one more node containing
    //         the value x.
    public static BSTNode insertBST( BSTNode t, int x )
    {
        if( t == null ) { return new BSTNode(null,x,null); }
        int val = BSTNode.rootValue(t);
        BSTNode left = BSTNode.left(t);
        BSTNode right = BSTNode.right(t);
        if( x < val )
            return new BSTNode(insertBST(left,x),val,right);
        else
            return new BSTNode(left,val,insertBST(right,x));
    }
    
    // Notkun: int x = H6.maxInBST(t);
    // Fyrir:  t != null; t er BSTNode, og tr�� er � vaxandi r��
    // Eftir:  x er st�rsta hn�tagildi � tr�nu t

    // Usage:  int x = H6.maxInBST(t);
    // Pre:    t != null; t is BSTNode, and the tree is in ascending order
    // Post:   x is the largest node-value in the tree t
    public static int maxInBST( BSTNode t )
    {
        while( BSTNode.right(t) != null )
            // Fastayr�ing lykkju: t != null
            // Loop invariant: t != null
            t = BSTNode.right(t);
        return BSTNode.rootValue(t);
    }
    
    // Notkun: BSTNode a = deleteBST(b,n);
    // Fyrir:  b er null e�a tv�leitartr�, n er heiltala
    // Eftir:
	//	(n er hn�tagildi � b, b hefur a.m.k. 2 hn�ta) ==> (a er tv�leitartr� me� 1 f�rri hn�tum en b; gildin � a me� n � vi�b�t eru gildin � b);
	//	(n er hn�tagildi � b, b hefur 1 hn�t) ==> a er null
	//	(n er ekki hn�tagildi � b) ==> a er afrit af b

    // Usage:  ?4?
    // Pre:    ?5?
    // Post:   ?6?
    public static BSTNode deleteBST( BSTNode t, int x )
    {
        if( t == null ) return null;
        int val = BSTNode.rootValue(t);
        BSTNode left = BSTNode.left(t);
        BSTNode right = BSTNode.right(t);
        if( x < val )
            return new BSTNode(deleteBST(left,x),val,right);
        if( x > val )
            return new BSTNode(left,val,deleteBST(right,x));
        if( left == null ) return right;
        if( right == null ) return left;
        int maxInLeft = maxInBST(left);
        BSTNode newLeft = deleteBST(left,maxInLeft);
        return new BSTNode(newLeft,maxInLeft,right);
    }
    
    // Notkun: H6.sort(a);
    // Fyrir:  a er heiltalnafylki.
    // Eftir:  a hefur veri� ra�a� � vaxandi r��.

    // Usage:  H6.sort(a);
    // Pre:    a is an int array.
    // Post:   a has been sorted in ascending order.
    public static void sort( int[] a )
    {
        BSTNode t = null;
        int i = 0;
        while( i != a.length )
            // Fastayr�ing lykkju: 0 <= i <= a.length; �llum gildum � a[..i] hefur veri� komi� fyrir � t
            // Loop invariant: ?7?
            t = insertBST(t,a[i++]);
        while( i != 0 )
            // Fastayr�ing lykkju: 0 <= i <= a.length; a[i..] er � vaxandi r��; t inniheldur i hn�ta
            // Loop invariant: ?8?
        {
            a[--i] = maxInBST(t);
            t = deleteBST(t,a[i]);
        }
    }
    
    public static void main( String[] args )
    {
        int[] a = new int[]{0,9,1,8,2,7,3,6,4,5,10,11,12,13,19,18,17,16,15,14,0,0,0,5,5,5};
        H6.sort(a);
        for( int i=0 ; i!=a.length ; i++ )
            // Fastayr�ing lykkju: Gildin � a[0],a[1],...,a[i-1] hafa veri� skrifu�.
            // Loop invariant: the values in a[0],a[1],...,a[i-1] have been written.
            System.out.print(a[i]+" ");
    }
}